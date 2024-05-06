import React, { useState, useEffect,isFocus } from "react";
import { StatusBar, Alert } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import Barcode from './Barcode';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { Colors } from './../components/styles';
import { db, auth } from '../firebase';

import {
  StyledContainer,
  InnerContainer,
  SubTitle,
  ButtonText,
  LojaLogo,
  StyledBarras,
  StyledPhotos,
  PhotoText,
  StyledPhotosButtons,
  StyleCardButtons,
  StyledCardsButton,
  CardPhoto 
} from './../components/styles'
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';

const { letras,branco } = Colors;

const CardSelect = ({ route }) => {
    const { id, name, img, barcodeData, frontImage, backImage, category } = route.params;
    const [categorias, setCategorias] = useState([]);
    const [imageFront, setImageFront] = useState(frontImage ? frontImage : null);
    const [imageBack, setImageBack] = useState(backImage ? backImage : null);
    const [categoria, setCat] = useState(null);
    const navigation = useNavigation();

    const handleSaveCard = () => {
        const cardData = {
            name: name,
            logoImage: img,
            barcodeData: barcodeData,
            format: 'ean13',
            frontImage: imageFront,
            backImage: imageBack,
            category: categoria,
            createdBy: auth.currentUser.uid
        };

        db.collection('cards').doc(id).update(cardData)
            .then(() => {
                console.log('Cartão atualizado com sucesso!');
                navigation.goBack();
            })
            .catch((error) => {
                console.error('Erro ao atualizar o cartão:', error);
            });
    };

    const handleRemoveCard = () => {
        if (!id) {
            console.error('ID do cartão não encontrado.');
            return;
        }

        Alert.alert(
            'Remover Cartão',
            'Tem certeza de que deseja remover este cartão?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Remover',
                    onPress: () => {
                        db.collection('cards').doc(id).delete()
                            .then(() => {
                                console.log('Cartão removido com sucesso!');
                                navigation.goBack();
                            })
                            .catch((error) => {
                                console.error('Erro ao remover o cartão:', error);
                            });
                    }
                }
            ]
        );
    };

    const pickImageFront = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageFront(result.assets[0].uri);
        }
    };

    const pickImageBack = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImageBack(result.assets[0].uri);
        }
    };

    useEffect(() => {
        const unsubscribe = db.collection('categorias').onSnapshot(snapshot => {
            const categoriasData = snapshot.docs.map(doc => ({
                label: doc.data().name,
                value: doc.id,
            }));
            setCategorias(categoriasData);
            setCat(category);
        });

        return () => unsubscribe();
    }, []);

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer principal={true}>
                <StatusBar style="dark" />
                <InnerContainer>
                    <LojaLogo source={{ uri: img }} />
                    <StyledBarras barras={true}>
                        <Barcode
                            value={barcodeData}
                            options={{ format: 'ean13' }}
                        />
                    </StyledBarras>
                    <StyledBarras>
                        <SubTitle>Fotos do cartão</SubTitle>
                        <StyledPhotosButtons>
                            {imageFront ? (
                                <CardPhoto source={{ uri: imageFront }} />
                            ) : (
                                <StyledPhotos onPress={pickImageFront}>
                                    <Octicons name="device-camera" size={30} />
                                    <PhotoText>FRENTE</PhotoText>
                                </StyledPhotos>
                            )}
                            {imageBack ? (
                                <CardPhoto source={{ uri: imageBack }} />
                            ) : (
                                <StyledPhotos onPress={pickImageBack}>
                                    <Octicons name="device-camera" size={30} />
                                    <PhotoText>VERSO</PhotoText>
                                </StyledPhotos>
                            )}
                        </StyledPhotosButtons>
                    </StyledBarras>
                    <SubTitle cart={true}>Categoria:</SubTitle>
                    <Dropdown
                        style={styles.dropdown}
                        data={categorias}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder={!isFocus ? category : '...'}
                        searchPlaceholder="Pesquisar..."
                        value={categoria}
                        onChange={item => setCat(item.label)}
                    />
                    <StyleCardButtons>
                        <StyledCardsButton cancel={true} onPress={handleRemoveCard}>
                            <ButtonText cancel={true}>Remover</ButtonText>
                        </StyledCardsButton>
                        <StyledCardsButton onPress={handleSaveCard}>
                            <ButtonText>Guardar</ButtonText>
                        </StyledCardsButton>
                    </StyleCardButtons>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

export default CardSelect;

const styles = StyleSheet.create({
    dropdown: {
        height: 50,
        width: 350,
        borderColor: letras,
        borderWidth: 0.5,
        borderRadius: 8,
        paddingHorizontal: 8,
        backgroundColor: branco,
        paddingLeft: 20,
    }
});
