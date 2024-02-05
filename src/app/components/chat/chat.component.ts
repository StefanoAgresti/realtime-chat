import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, map } from 'rxjs';

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
export class ChatComponent implements OnInit {
  constructor(
    private chatService: ChatService,
    private db: AngularFireDatabase,
    private authService: AuthService
  ) {}

  messages!: Observable<any>; //messaggi presi da db, trasformati in key,val

  messageRef: any; //ref al 2-way binding nel template
  messagesDbRef!: AngularFireList<any>; //lista dei messaggi dal db

  user!: any; //variabile a cui assegno utente loggato

  //update
  editMode: boolean = false;
  messageUserId: string = '';
  messageKey: string = '';

  //message timestamp
  msgTimestamp: Date = new Date();
  msgHours: Number = this.msgTimestamp.getHours();
  msgMinutes: Number = this.msgTimestamp.getMinutes();
  messageDateFormatted: String = `${this.msgHours}:${this.msgMinutes}`;

  ngOnInit(): void {
    this.messagesDbRef = this.db.list('messages');
    this.messages = this.messagesDbRef
      .snapshotChanges()
      .pipe(
        map((changes) =>
          changes.map((c) => ({ key: c.payload.key, ...c.payload.val() }))
        )
      );

    this.authService.getCurrentUser().subscribe((user) => (this.user = user));
  }

  onSubmit(chatForm: NgForm) {
    if (this.editMode) {
      this.onUpdate();
    } else {
      this.chatService.sendMessage(
        this.messageRef,
        this.messagesDbRef,
        this.messageDateFormatted
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
    if (this.messageRef.trim() !== '') {
      this.chatService.updateMessage(
        this.messageKey,
        this.messagesDbRef,
        this.messageUserId,
        this.messageRef
      );
      this.editMode = false;
    }
  }

  onLogout() {
    this.authService.logout();
  }
}
