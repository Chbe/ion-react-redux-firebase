import React from 'react'
import { IonList, IonItem, IonAvatar, IonSkeletonText, IonLabel } from '@ionic/react';

const SkeletonScores = () => {
    return (
        <IonList>
            {[1, 2, 3, 4].map((key) => {
                return <IonItem key={key}>
                    <IonAvatar slot="start">
                        <IonSkeletonText animated />
                    </IonAvatar>
                    <IonLabel>
                        <IonSkeletonText animated style={{ width: '50%' }} />
                    </IonLabel>
                </IonItem>
            })}
        </IonList>
    )
}
export default SkeletonScores
