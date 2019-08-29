import React from 'react';
import { useFirestore } from 'react-redux-firebase';
import { IonHeader, IonContent, IonToolbar, IonButtons, IonBackButton, IonButton, IonTitle, IonItem, IonCard, IonList, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCardContent, IonFooter } from '@ionic/react';


const Games = [
    {
        "lastUpdated": 1566838357256,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
            }
        ],
        "playersUid": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "status": "completed",
        "title": "Waterloo",
        "winner": "qqVFZHHv1pV99K3sHxXB5mnBP2t1"
    },
    {
        "activePlayer": "",
        "admin": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
        "lastUpdated": 1566838357256,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true,
                "accepted": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true,
                "accepted": false
            }
        ],
        "playersUid": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "status": "pending",
        "title": "Ett skepp kommer lastat"
    },
    {
        "activePlayer": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
        "admin": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
        "lastUpdated": 1566894450445,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true,
                "accepted": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 3,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true,
                "accepted": true
            }
        ],
        "playersUid": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "status": "active",
        "title": "Jalla jalla"
    },
    {
        "activePlayer": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
        "admin": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
        "lastUpdated": 1566841151682,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true,
                "accepted": true
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true,
                "accepted": true
            }
        ],
        "playersUid": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "status": "active",
        "title": "Make America Great Again"
    },
    {
        "activePlayer": "",
        "admin": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
        "lastUpdated": 1566838357256,
        "players": [
            {
                "displayName": "Donald Trump",
                "photoURL": "https://pbs.twimg.com/profile_images/874276197357596672/kUuht00m_400x400.jpg",
                "score": 0,
                "uid": "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
                "isActive": true,
                "accepted": false
            },
            {
                "displayName": "Christopher Bengtsson",
                "photoURL": "https://lh4.googleusercontent.com/-OSL5arcBFkA/AAAAAAAAAAI/AAAAAAAAFqY/8VJ08SUVZPI/photo.jpg",
                "score": 0,
                "uid": "52oabfOhMEaB7GoxwmGEvwWV7LI2",
                "isActive": true,
                "accepted": true
            }
        ],
        "playersUid": [
            "qqVFZHHv1pV99K3sHxXB5mnBP2t1",
            "52oabfOhMEaB7GoxwmGEvwWV7LI2"
        ],
        "status": "pending",
        "title": "Kastrull"
    }
]

const TestGenerateGames = ({ history }) => {
    const firestore = useFirestore();

    const batchUpdate = async () => {
        const gamesCol = await firestore.collection('games').get();
        gamesCol.docs.forEach(doc => {
            firestore.delete(`games/${doc.id}`)
        });
        Games.forEach(game => {
            firestore
                .collection('games')
                .add(game);
        });
        history.push('/');
    }
    return (
        <>
            <IonHeader style={{background: 'transparent'}}>
                <IonToolbar style={{background: 'transparent'}}>
                    <IonButtons slot="start">
                        <IonBackButton defaultHref="/" />
                    </IonButtons>
                    <IonTitle>My Navigation Bar</IonTitle>
                </IonToolbar>

                <IonToolbar>
                    <IonTitle>Subheader</IonTitle>
                </IonToolbar>
            </IonHeader>

            <IonContent fullscreen={false}>
                <IonItem>
                    <IonButton
                        onClick={(ev) => {
                            ev.preventDefault();
                            batchUpdate(Games);
                        }}>
                        Insert games
                    </IonButton>
                </IonItem>
                <IonList>
                    {Games.map(game => {
                        return <IonCard>
                            <IonCardHeader>
                                <IonCardSubtitle>{game.status} Subtitle</IonCardSubtitle>
                                <IonCardTitle>{game.title} Title</IonCardTitle>
                            </IonCardHeader>

                            <IonCardContent>
                                Keep close to Nature's heart... and break clear away, once in awhile,
                                and climb a mountain or spend a week in the woods. Wash your spirit clean.
                        </IonCardContent>
                        </IonCard>
                    })}
                </IonList>
            </IonContent>
        </>
    )
}

export default TestGenerateGames
