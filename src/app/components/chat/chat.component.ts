import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription, map } from 'rxjs';

import {
  AngularFireDatabase,
  AngularFireList,
} from '@angular/fire/compat/database';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit, OnDestroy {
  constructor(
    private chatService: ChatService,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  messages!: Observable<any>; //messages from db transformed in key,val
  messageRef: any; //2-way binding template ref
  messagesDbRef!: AngularFireList<any>; //messages list from db
  user!: any; //logged in user
  authSub!: Subscription;

  //update
  editMode: boolean = false;
  messageUserId: string = '';
  messageKey: string = '';

  ngOnInit(): void {
    this.messagesDbRef = this.db.list('messages');
    this.messages = this.messagesDbRef
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );

    this.authSub = this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.user = user;
      } else this.user = null;
    });
  }

  onSubmit(chatForm: NgForm) {
    let date: Date = new Date();
    let createdAt: string = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (this.editMode) {
      this.onUpdate();
    } else {
      this.chatService.sendMessage(
        this.messageRef,
        this.messagesDbRef,
        createdAt
      );
    }
    chatForm.reset();
  }

  onDelete(messageKey: string, messageUserId: string) {
    if (confirm('Are you sure to delete the message?')) {
      this.chatService.deleteMessage(
        messageKey,
        this.messagesDbRef,
        messageUserId
      );
    }
  }

  onToggleEditMode(message: any) {
    this.editMode = true;
    this.messageRef = message.text;
    this.messageKey = message.key;
    this.messageUserId = message.user.id;
  }

  onUpdate() {
    let date: Date = new Date();
    let updatedAt: string = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    if (this.messageRef.trim() !== '') {
      this.chatService.updateMessage(
        this.messageKey,
        this.messagesDbRef,
        this.messageUserId,
        this.messageRef,
        updatedAt
      );
      this.editMode = false;
    }
  }

  cancelUpdate() {
    this.messageRef = '';
    this.editMode = false;
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }
}
