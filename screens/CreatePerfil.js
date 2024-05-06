import React,{useState, useEffect,useRef} from "react";
import { StatusBar } from 'expo-status-bar';
import { Dropdown } from 'react-native-element-dropdown';
import Barcode from './Barcode';
import * as ImagePicker from 'expo-image-picker';

import { useNavigation } from '@react-navigation/native';


import {View, TouchableOpacity, ActivityIndicator,Text,StyleSheet, Image} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Camera, CameraType } from 'expo-camera';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//colors
import {Colors, StyledLista} from '../components/styles';

import { db, auth } from '../firebase';

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
    AlineButtons

} from '../components/styles'

//colors
const{texto,darkLight,verde, branco,letras} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';




const CreatePerfil =() => {
    
    const [hasPermission, setHasPermission] = useState(null);
    const [name,setName]=useState();
    const [surname,setSurname]=useState();
    const navigation = useNavigation();
    


    const [imageFront, setImageFront] = useState(null);

    const [userPerfil, setUserPerfil] = useState(null);

    
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


    useEffect(() => {
      (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
      })();
  }, []);

  const savePerfil = async () => {
    const userId = auth.currentUser.uid;

    try {
        await db.collection('perfil').add({
            name: name,
            surname: surname,
            image: imageFront,
            userId: userId
        });
        console.log('Perfil salvo com sucesso!');
        // Navegar diretamente para a página PerfilPage após salvar o perfil
        navigation.navigate('PerfilPage');
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
    }
};



    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer>
                    {imageFront ? ( 
                    <PerfilPhoto source={{ uri: imageFront }} />
                      ):(
                      <StyledPhotos perfil={true} onPress={pickImageFront}>
                        <Octicons name="device-camera" size={50}/>
                      </StyledPhotos>
                    )}
                    <SubTitle createPerfil={true}>Inserir dados:</SubTitle>
                    <StyledFormArea>
                            <MyTextInput
                                icon = "person"
                                placeholder="Nome"
                                placeholderTextColor={darkLight}
                                onChangeText={(name) => setName(name)}
                                values={name}
                            />
                            <MyTextInput
                                icon = "person"
                                placeholder="Apelido"
                                placeholderTextColor={darkLight}
                                onChangeText={(surname) => setSurname(surname)}
                                values={surname}
                            />                                               
                        </StyledFormArea>
                        <StyleCardButtons perfil={true}>
                            <StyledButton google={true} onPress={() => navigation.goBack()}>
                                <ButtonText cancel={true}>Cancelar</ButtonText>
                            </StyledButton >
                            <StyledButton createPerfil={true}  onPress={savePerfil} >
                                <ButtonText>Salvar</ButtonText>
                            </StyledButton>
                        </StyleCardButtons>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};


const MyTextInput = ({label, icon,...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={25} color={texto}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>            
        </View>
    )
}

export default CreatePerfil;

