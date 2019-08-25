import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { IonContent, IonItem, IonHeader, IonToolbar, IonButtons, IonButton, IonIcon, IonAvatar, IonLabel } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import { inGameCleanUp } from '../../../store/actions';

const Scoreboard = ({ scoreboard, cleanUp, history }) => {
    useEffect(() => {
        console.log('Scoreboard enter');
        return () => {
            console.log('Scoreboard leave');
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
                {scoreboard && scoreboard
                    .map(scoreObj => {
                        return <IonItem key={scoreObj.uid}>
                            <IonAvatar slot="start">
                                <img src={scoreObj.photoURL} />
                            </IonAvatar>
                            <IonLabel>
                                <h2>{scoreObj.displayName} | {scoreObj.score} </h2>
                            </IonLabel>
                        </IonItem>
                    })}
            </IonContent>
        </>
    )
}

const mapStateToProps = ({ gameReducer }) => ({
    scoreboard: gameReducer.scoreboard,
});

const mapDispatchToProps = {
    cleanUp: inGameCleanUp
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Scoreboard)
