import React from 'react'
import {
    IonList,
    IonCard,
    IonCardHeader,
    IonCardSubtitle,
    IonSkeletonText,
    IonCardTitle,
    IonCardContent
} from '@ionic/react';

const SkeletonGames = () => {
    return (
        <IonList>
            {[1, 2, 3, 4].map((key) => {
                return <IonCard key={key}>
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
            })}
        </IonList>
    )
}

export default SkeletonGames;
