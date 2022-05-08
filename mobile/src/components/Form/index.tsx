import React, { useState } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Image,
    TextInput
} from 'react-native';
import * as FileSystem from 'expo-file-system';

import { captureScreen } from 'react-native-view-shot';
import { feedbackTypes } from '../../utils/feedbackTypes';
import { FeedbackType } from '../Widget';
import { ArrowLeft } from 'phosphor-react-native';
import { theme } from '../../theme';
import { ScreenshotButton } from '../ScreenshotButton';
import { Button } from '../../components/Button';

import { styles } from './styles';
import { api } from '../../libs/api';

interface FormProps {
    feedbackType: FeedbackType;
    onFeednackCanceled: () => void;
    onFeedbackSent: () => void;
}

export function Form({ feedbackType, onFeednackCanceled, onFeedbackSent }: FormProps) {
    const [comment, setComment] = useState('');
    const [isSendingFeedback, setIsSendingFeedback] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);

    const feedbackTypeInfo = feedbackTypes[feedbackType];

    function handleScreenshot() {
        captureScreen({
            format: 'jpg',
            quality: 0.8
        })
            .then(uri => setScreenshot(uri))// enderoço da imagem onde ela está armazenada de forma temporária no nosso dispositivo
            .catch(error => console.log(error));
    }

    function handleScreenshotRemove() {
        setScreenshot(null);
    }

    async function handleSendFeedback() {
        if (isSendingFeedback) return;

        setIsSendingFeedback(true);
        //Convertendo screenshot para base64
        const screenshotBase64 = screenshot && await FileSystem.readAsStringAsync(screenshot, { encoding: 'base64' });

        try {
            await api.post('/feedbacks', {
                type: feedbackType,
                screenshot: `data:image/png;base64, ${screenshotBase64}`,
                comment
            });

            onFeedbackSent();
        } catch (error) {
            console.log(error);
            setIsSendingFeedback(false);
        }
    }


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={onFeednackCanceled}
                >
                    <ArrowLeft
                        size={24}
                        weight='bold'
                        color={theme.colors.text_secondary}
                    />
                </TouchableOpacity>

                <View style={styles.titleContainer}>
                    <Image
                        source={feedbackTypeInfo.image}
                        style={styles.image}
                    />
                    <Text style={styles.titleText}>
                        {feedbackTypeInfo.title}
                    </Text>
                </View>
            </View>

            <TextInput
                multiline
                style={styles.input}
                placeholder='Algo não está funcionando bem? Queremos corrigir. Conte com detalhes o que está acontecendo...'
                placeholderTextColor={theme.colors.text_secondary}
                autoCorrect={false}
                onChangeText={setComment}
            />

            <View style={styles.footer}>
                <ScreenshotButton
                    screenshot={screenshot}
                    onRemoveShot={handleScreenshotRemove}
                    onTakeShot={handleScreenshot}
                />

                <Button
                    onPress={handleSendFeedback}
                    isLoading={isSendingFeedback}
                />
            </View>
        </View>
    );
}