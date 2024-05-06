import React, { useState, useEffect } from "react";
import { StatusBar} from 'expo-status-bar';
import { Alert } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Octicons } from '@expo/vector-icons';
import { db, auth } from '../firebase';
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';
import { LongPressGestureHandler, State } from 'react-native-gesture-handler'; // Importação correta aqui

//colors
import {Colors, StyledLista} from '../components/styles';

import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledFormArea,
  LeftIcon,
  StyledInputLabel,
  StyledTextInput,
  RightIcon,
  StyledButton,
  ButtonText,
  ButtonLink,
  MsgBox,
  Line, 
  ExtraText,
  ExtraView,
  TextLink,
  TextLinkContent, 
  Perfil,
  StyledCategory, 
  Category,
  CategoryText,
  CategoryContainer,
  StyledMenu,
  Menu,
  MenuText,
  MenuContainer,
  StyledTitle,
  LojaLogo,
  StyledBarras,
  StyledPhotos,
  PhotoText,
  StyledPhotosButtons,
  StyleCardButtons,
  StyledCardsButton,
  CardPhoto,
  PerfilPhoto,
  DisplayCard,
  StyledPerfilPhoto,
  CardDisplayText  
} from '../components/styles';

//colors
const{texto,darkLight,verde, branco,letras} = Colors;

const PerfilPage = () => {
    const [userProfiles, setUserProfiles] = useState([]);
    const [currentProfile, setCurrentProfile] = useState(null);
    const [userPerfil, setUserPerfil] = useState(null);
    const navigation = useNavigation();


    useEffect(() => {
        const fetchUserProfiles = async () => {
            const userId = auth.currentUser.uid;
            try {
                const snapshot = await db.collection('perfil').where('userId', '==', userId).get();
                const profiles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setUserProfiles(profiles);
            } catch (error) {
                console.error('Erro ao buscar perfis do usuário:', error);
            }
        };
        fetchUserProfiles();
    }, []);

    useEffect(() => {
        const fetchCurrentProfile = async () => {
            const userId = auth.currentUser.uid;
            try {
                const snapshot = await db.collection('users').doc(userId).get();
                if (snapshot.exists) {
                    const userData = snapshot.data();
                    const currentProfileId = userData.currentProfile;
    
                    // Se existir um currentProfileId no documento do usuário
                    if (currentProfileId) {
                        // Busca o perfil correspondente na coleção 'perfil'
                        const profileSnapshot = await db.collection('perfil').doc(currentProfileId).get();
                        if (profileSnapshot.exists) {
                            // Define o perfil encontrado como o currentProfile
                            setCurrentProfile({ id: profileSnapshot.id, ...profileSnapshot.data() });
                        } else {
                            console.error('Perfil não encontrado.');
                        }
                    } else {
                        console.error('Nenhum currentProfile definido para o usuário.');
                    }
                } else {
                    console.error('Usuário não encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar o perfil do usuário:', error);
            }
        };
    
        fetchCurrentProfile();
    }, []);

    const selectCurrentProfile = async (profile) => {
        setCurrentProfile(profile);

        try {
            // Atualizar a variável 'currentProfile' no Firestore para o ID do perfil selecionado
            await db.collection('users').doc(auth.currentUser.uid).update({
                currentProfile: profile.id
            });
            console.log('Variável currentProfile atualizada no Firestore');
        } catch (error) {
            console.error('Erro ao atualizar a variável currentProfile no Firestore:', error);
        }
    };
    const pickImageFront = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            try {
                // Atualizar o documento no Firestore
                await db.collection('perfil').doc(currentProfile.id).update({
                    image: result.assets[0].uri,
                });
                
                // Atualizar o estado currentProfile manualmente
                setCurrentProfile(prevProfile => ({
                    ...prevProfile,
                    image: result.assets[0].uri
                }));
    
                console.log('Imagem do perfil atualizada com sucesso!');
            } catch (error) {
                console.error('Erro ao enviar a imagem para a Firebase:', error);
            }
        }
    };
    
    

    
    const handleRemoveProfile = async (profileId) => {
        try {
            await db.collection('perfil').doc(profileId).delete();
            console.log('Perfil removido com sucesso!');
            // Atualizar a lista de perfis após a remoção
            const updatedProfiles = userProfiles.filter(profile => profile.id !== profileId);
            setUserProfiles(updatedProfiles);
        } catch (error) {
            console.error('Erro ao remover perfil:', error);
        }
    };

    const handleLongPress = (profileId) => {
        Alert.alert(
            'Remover Perfil',
            'Tem certeza de que deseja remover este perfil?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Remover',
                    onPress: () => handleRemoveProfile(profileId)
                }
            ]
        );
    };
    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer>
                    {currentProfile && currentProfile.image ? ( 
                    <PerfilPhoto source={{ uri: currentProfile.image }} />
                      ):(
                      <StyledPhotos perfil={true} onPress={pickImageFront}>
                        <Octicons name="device-camera" size={50}/>
                      </StyledPhotos>
                    )}
                    {currentProfile && (
                        <SubTitle perfil={true}>{currentProfile.name} {currentProfile.surname}</SubTitle>
                    )}
                    <SubTitle mudarPerfil={true}>Mudar Perfil:</SubTitle>
                    
    
                    {currentProfile && userProfiles.map(profile => (
                        <DisplayCard key={profile.id} perfil={true} onLongPress={() => handleLongPress(profile.id)} onPress={() => selectCurrentProfile(profile)} isSelected={profile.id === currentProfile.id}>
                            {profile.image ? ( 
                                <PerfilPhoto perfil={true} source={{ uri: profile.image }} />
                            ) : (
                                <StyledPerfilPhoto>
                                    <Octicons name="device-camera" size={30}/>
                                </StyledPerfilPhoto>
                            )}
                            <CardDisplayText>{profile.name} {profile.surname}</CardDisplayText>
                        </DisplayCard>
                    ))}
                        
                    
                    <DisplayCard addPerfil={true} onPress={()=>navigation.navigate('CreatePerfil')}>
                    <ButtonText addPerfil={true}>+ Adicionar perfil</ButtonText>
                    </DisplayCard>
                    
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};


export default PerfilPage;
