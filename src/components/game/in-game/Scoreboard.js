import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { IonContent, IonItem, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonLabel } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { inGameCleanUp } from '../../../store/actions';
import { firestoreConnect } from 'react-redux-firebase';
import SkeletonScores from '../../skeletons/SkeletonScores';

const Scoreboard = ({ game, cleanUp, history }) => {
    useEffect(() => {
        return () => {
            cleanUp();
        };
    }, [])
    return (
        <>
            <IonHeader>
                <IonToolbar>
                    <IonButtons slot='start'>
                        <IonButton onClick={(ev) => {
                            ev.preventDefault();
                            history.push('/');
                        }}>
                            <IonIcon slot="icon-only" icon={arrowBack} />
                        </IonButton>
                    </IonButtons>
                    <IonLabel>Scoreboard</IonLabel>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                {game
                    ? [...game[0].scoreboard]
                        .sort((a, b) => a.score < b.score)
                        .map(scoreObj => {
                            return <IonItem key={scoreObj.uid}>
                                <IonAvatar slot="start">
                                    <img src={scoreObj.photoURL} />
                                </IonAvatar>
                                <IonLabel>
                                    <h2>{scoreObj.displayName} | {scoreObj.score} </h2>
                                </IonLabel>
                            </IonItem>
                        })
                    : <SkeletonScores />}
            </IonContent>
        </>
    )
}

const mapStateToProps = ({ firestore }) => ({
    game: firestore.ordered.game
});

const mapDispatchToProps = {
    cleanUp: inGameCleanUp
};

export default compose(
    firestoreConnect((props) => [
        {
            collection: `games`,
            doc: props.match.params.gameId,
            storeAs: 'game'
        }
    ]),
    connect(
        mapStateToProps,
        mapDispatchToProps
    ))(Scoreboard)
