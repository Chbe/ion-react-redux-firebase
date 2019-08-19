import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux';
import { firestoreConnect } from 'react-redux-firebase';
import { happy } from 'ionicons/icons';
import {
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonIcon,
  IonItem,
  IonCard,
  IonList,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonSkeletonText
} from '@ionic/react';

const Home = ({ games, history }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="end">
            <IonButton
              onClick={(ev) => {
                ev.preventDefault();
                history.push('/profile');
              }}>
              <IonIcon slot="end" icon={happy}></IonIcon>
            </IonButton>
          </IonButtons>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {games ?

          <IonList>
            {games.map(game => {
              return <IonCard key={game.id}>
                <IonCardHeader>
                  <IonCardSubtitle>
                    {game.status === 'pending' ? game.status : game.activePlayer}
                  </IonCardSubtitle>
                  <IonCardTitle style={{ textAlign: 'center' }}>{
                    game.title}
                  </IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  {(new Date(game.lastUpdated)).toString()}
                </IonCardContent>
              </IonCard>
            })}
          </IonList> :

          <IonCard key='1'>
            <IonCardHeader>
              <IonCardSubtitle>
                <IonSkeletonText animated style={{ width: '10%' }} />
              </IonCardSubtitle>
              <IonCardTitle style={{ textAlign: 'center' }}>
                <IonSkeletonText animated style={{ width: '20%%' }} />
              </IonCardTitle>
            </IonCardHeader>

            <IonCardContent>
              <IonSkeletonText animated style={{ width: '40%%' }} />
            </IonCardContent>
          </IonCard>
        }
      </IonContent>
    </>
  )
}

const mapStateToProps = ({ firebase, firestore }) => ({
  uid: firebase.auth.uid,
  games: firestore.ordered.games
});

export default compose(
  //withRouter, if you use react router to redirect
  firestoreConnect(props => [{
    collection: 'games',
    where: [
      ['playersUid', 'array-contains',
        {
          uid: props.firebase.auth().currentUser.uid
        }
      ]
    ],
    orderBy: [
      ['status', 'asc'],
      ['lastUpdated', 'desc']
    ]
  }]),
  connect((mapStateToProps))
)(Home)