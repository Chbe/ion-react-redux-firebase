import React from 'react'
import { IonItem, IonAvatar, IonSkeletonText, IonLabel } from '@ionic/react';

const SkeletonScores = () => {
    return ([1, 2, 3, 4].map((key) => {
        return <IonItem key={key}>
            <IonAvatar slot="start">
                <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel>
                <IonSkeletonText animated style={{ width: '50%' }} />
            </IonLabel>
        </IonItem>
    })
    )
}
export default SkeletonScores
