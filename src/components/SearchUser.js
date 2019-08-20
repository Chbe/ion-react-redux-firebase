import React from 'react'
import { compose } from 'redux';
import { connect } from 'react-redux'
import { withHandlers } from 'recompose';
import { IonSearchbar } from '@ionic/react';
import { withFirestore } from 'react-redux-firebase';

const SearchUser = ({ searchUser }) => {
    return (
        <div>
            <IonSearchbar
                animated
                placeholder="Search for user..."
                onIonChange={({ detail: { value } }) => value && searchUser(value)}
                debounce={1000}
            ></IonSearchbar>
        </div>
    )
}

const enhance = compose(
    withFirestore,
    withHandlers({
        searchUser: ({ firestore }) => (searchValue) => {
            if (!searchValue || !searchValue.trim().length) {
                return [];
            } else {
                return firestore.get({
                    collection: 'users',
                    where: ['searchName', '==', searchValue.trim().toLowerCase()],
                    storeAs: 'searchResult'
                })
            }
        }
    }),
    connect(({ firestore }) => ({
        searchResult: firestore.ordered.searchResult,
    }))
)
export default enhance(SearchUser)