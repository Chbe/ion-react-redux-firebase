import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import { IonContent, IonButton } from '@ionic/react';

const Games = [
    {
        "acceptedInvites": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
        ],
        "activePlayer": {

        },
        "admin": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
        "lastUpdated": 1566838357256,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true
            }
        ],
        "playersUid": [
            {
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
            },
            {
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2"
            }
        ],
        "status": "pending",
        "title": "Ett skepp kommer lastat"
    },
    {
        "acceptedInvites": [
            "52oabfOhMEaB7GoxwmGEvwWV7LI2",
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
        ],
        "activePlayer": {
            "displayName": "Christopher Bengtsson",
            "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
            "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        },
        "admin": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
        "lastUpdated": 1566894450445,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 4,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true
            }
        ],
        "playersUid": [
            {
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
            },
            {
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2"
            }
        ],
        "status": "active",
        "title": "Jalla jalla"
    },
    {
        "acceptedInvites": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "activePlayer": {
            "displayName": "Donald Trump",
            "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
            "score": 0,
            "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
        },
        "admin": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
        "lastUpdated": 1566841151682,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true
            }
        ],
        "playersUid": [
            {
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
            },
            {
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2"
            }
        ],
        "status": "active",
        "title": "Make America Great Again"
    },
    {
        "acceptedInvites": [
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "activePlayer": {

        },
        "admin": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
        "lastUpdated": 1566838357256,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true
            }
        ],
        "playersUid": [
            {
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
            },
            {
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2"
            }
        ],
        "status": "pending",
        "title": "Kastrull"
    }
]

const TestGenerateGames = ({ history }) => {
    const firestore = useFirestore();

    const batchUpdate = () => {
        Games.forEach(game => {
            firestore
                .collection('games')
                .add(game);
        });
        history.push('/');
    }
    return (
        <IonContent>
            <IonButton
                onClick={(ev) => {
                    ev.preventDefault();
                    batchUpdate(Games);
                }}
            >
                Insert games
            </IonButton>
        </IonContent>
    )
}

export default TestGenerateGames
