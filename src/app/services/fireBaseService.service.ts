import { Injectable } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

import {AngularFireStorage} from '@angular/fire/storage';

export interface Idea {
    id?: string;
    name: string;
    notes: string;
}

@Injectable()
export class FireBaseService {

    constructor(private af: AngularFireStorage) {}


    async uploadFileToStorage(file, type, name) {
        const randomId = Math.random()
            .toString(36)
            .substring(2, 8);

        const oMyBlob = new Blob([file], {type});

        const uploadTask = this.af.upload(
            `files/${new Date().getTime()}_${randomId}_${name}`,
            oMyBlob
        );

        uploadTask.then(async res => {
            console.log('file upload finished!');
        }).catch(err =>  {
            console.log('file wasnt upload. Error: ' + err);
        });
    }

}

