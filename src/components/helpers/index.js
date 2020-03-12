import React from 'react';
import axios from 'axios';
import { notification } from 'antd';
import { Event } from '../tracking';

const API_URL = process.env.REACT_APP_API_URL || 'https://api.readrr.app';

export const updateBookItem = (userId, readrrId, inLibrary, book, action, favorite, readingStatus) => {

    const method = (inLibrary ? 'put' : 'post');

    let data;
    if(inLibrary){
        data = {
            bookId: readrrId,
            readingStatus: parseInt(readingStatus),
            favorite: favorite
        }
    }else{
        data = {
            book,
            favorite: favorite, 
            readingStatus: parseInt(readingStatus)
        }
    }

    // Save a book as a favorite or update its reading status
    axios({
        method,
        url: `${API_URL}/api/${userId}/library`,
        data
    })
    .then(results => {
        // Analytics Event action
        if(action === 'favorite') {
            Event('Search', (favorite ? 'User added a book to favorites from search list.' : 'User removed a book from favorites on search list.' ),'SEARCH_RESULT');
            sendUpTheFlares('success', 'Success', (favorite ? 'Book added to favorites.' : 'Book removed from favorites.'));
        }else{
            Event('Search', 'User added a book to start tracking from search list.', 'SEARCH_RESULT');
            sendUpTheFlares('success', 'Success', 'Reading status has been updated.');
        }
        return results.bookId
    })
    .catch(err => {
        console.log(err)
        Event('Search', 'Error adding a book to favorites/tracking.', 'UPDATE_BOOK_ITEM');
        sendUpTheFlares('success', 'Success', 'Reading status has been updated.');
    });
}

export const sendUpTheFlares = (type, message, description) => {
    notification.open({
        type,
        message,
        description,
        duration: 1.5
    });   
}

export const updateDates = (userId, readrrId, dateString, whichDate) => {

    let dateObj;
    // whichDate 0/true for start date 
    // 1/false for end date
    if(!whichDate){
        dateObj = {
            bookId: readrrId,
            dateStarted: dateString
        }
    }else{
        dateObj = {
            bookId: readrrId,
            dateEnded: dateString
        }
    }
    
    axios
        .put(`${API_URL}/api/${userId}/library`, dateObj)
        .then(result => {console.log(result)
            return result
        })
        .catch(err => console.log(err))
}