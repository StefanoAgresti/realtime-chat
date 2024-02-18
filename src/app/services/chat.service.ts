import { Injectable } from '@angular/core';

import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private authData: AngularFireAuth) {}

  sendMessage(
    message: string,
    messagesDbRef: AngularFireList<any>,
    msgCreatedAt: string
  ) {
    this.authData.authState.subscribe((currentUser) => {
      if (currentUser) {
        const user = {
          email: currentUser.email,
          username: currentUser.displayName,
          id: currentUser.uid,
        };
        if (message.trim() == '') {
          return;
        } else {
          messagesDbRef
            .push({
              text: message,
              user: user,
              createdAt: msgCreatedAt,
            })
            .then(() => {
              message = '';
            })
            .catch((error) => console.log(error));
        }
      }
    });
  }

  deleteMessage(
    messageKey: string,
    messagesDbRef: AngularFireList<any>,
    messageUserId: string
  ) {
    this.authData.authState.subscribe((currentUser) => {
      if (currentUser) {
        if (currentUser.uid !== messageUserId) return;
        else {
          messagesDbRef.remove(messageKey);
        }
      }
    });
  }

  updateMessage(
    messageKey: string,
    messagesDbRef: AngularFireList<any>,
    messageUserId: string,
    updatedText: string,
    msgUpdatedAt: string
  ) {
    this.authData.authState.subscribe((currentUser) => {
      if (currentUser) {
        if (currentUser.uid === messageUserId) {
          if (updatedText.trim() !== '') {
            messagesDbRef
              .update(messageKey, {
                text: updatedText,
                updatedAt: msgUpdatedAt,
              })
              .then(() => {
                updatedText = '';
              })
              .catch((err) => console.log(err));
          }
        }
      }
    });
  }
}
