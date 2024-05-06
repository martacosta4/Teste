import React,{useState, useEffect,useRef} from "react";
import { StatusBar } from 'expo-status-bar';
import { Dropdown } from 'react-native-element-dropdown';
import Barcode from './Barcode';
import * as ImagePicker from 'expo-image-picker';
import { useIsFocused } from '@react-navigation/native';

import { FileSystem } from 'expo';

import { useNavigation } from '@react-navigation/native';


import {View, TouchableOpacity, ActivityIndicator,Text,StyleSheet, Image} from 'react-native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { Camera, CameraType } from 'expo-camera';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//colors
import {Colors} from './../components/styles';

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
    CardPhoto  
} from './../components/styles'

//colors
const{texto,darkLight,verde, branco,letras} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';


const Cartao =({ route}) => {
    const {img,cat,barcodeData, name } = route.params;
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const isFocused = useIsFocused();

    const navigation = useNavigation();
    
    const [fullScreenImageUri, setFullScreenImageUri] = useState(null);
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);


    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);

    const [categoria, setCat] = useState(null);
    const [user, setUser] = useState(null);
    
    useEffect(() => {
      const loadUserData = async () => {
          try {
              const userId = auth.currentUser.uid;
              const userRef = await db.collection('users').doc(userId).get();
              setUser(userRef.data().currentProfile);
              console.log(user);
          } catch (error) {
              console.error('Erro ao carregar os dados do usuário:', error);
          }
      };
      loadUserData();
  }, [isFocused]);

  

    const handleShowFullScreenImage = (imageUri) => {
      setFullScreenImageUri(imageUri);
      setShowFullScreenImage(true);
    };
    
    const handleSaveCard = () => {
      const cardData = {
          name: name,
          logoImage: img,
          barcodeData: barcodeData,
          format:'ean13',
          frontImage: imageFront,
          backImage: imageBack, 
          category: categoria, 
          createdBy: user,
          date : new Date()
          
      };
  
      db.collection('cards').add(cardData)
          .then(() => {
              console.log('Cartão salvo com sucesso!');
              setImageFront(null);
              setImageBack(null);
              navigation.navigate('MainTabs');

              
              
        
          })
          .catch((error) => {
              console.error('Erro ao salvar o cartão:', error);
              // Lidar com o erro conforme necessário, como exibir uma mensagem de erro para o usuário.
          });
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

   

    const cameraRef = useRef(null);

    useEffect(() => {
      (async () => {
          const { status } = await Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
         
      })();
  }, []);

  

 
      useEffect(() => {
        const unsubscribe = db.collection('categorias').onSnapshot(snapshot => {
            const categoriasData = snapshot.docs.map(doc => ({
                label: doc.data().name,
                value: doc.id
            }));
            setCategorias(categoriasData);
            setCat(cat)
            
            

        });

        return () => unsubscribe();
    }, []);

    if (showFullScreenImage) {
      return (
        <View style={styles.fullScreenContainer}>
          <TouchableOpacity onPress={() => setShowFullScreenImage(false)}>
            <Image source={{ uri: fullScreenImageUri }} style={styles.fullScreenImage} />
          </TouchableOpacity>
        </View>
      );
    }
    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer>
                    <LojaLogo source={{ uri: img }} />
                    <StyledBarras barras={true}>
                    <Barcode
                      value={barcodeData}
                      options={{ format: 'ean13' }}
                    />
                    </StyledBarras>
              
                    <StyledBarras >
                    <SubTitle>Fotos do cartão</SubTitle>
                    <StyledPhotosButtons>
                    
                    {imageFront ? ( 
                    <CardPhoto source={{ uri: imageFront }} onPress={() => handleShowFullScreenImage(imageFront)} />
                      ):(
                      <StyledPhotos onPress={pickImageFront}>
                        <Octicons name="device-camera" size={30}/>
                        <PhotoText>FRENTE</PhotoText> 
                      </StyledPhotos>
                    )}
                    
                    {imageBack ? ( 
                    <CardPhoto source={{ uri: imageBack }}/>
                      ):(
                      <StyledPhotos onPress={pickImageBack}>
                        <Octicons name="device-camera" size={30}/>
                        <PhotoText>VERSO</PhotoText> 
                      </StyledPhotos>
                    )}

                    </StyledPhotosButtons>
                    </StyledBarras>
                    
                   

                    
                    <SubTitle cart={true}>Categoria:</SubTitle>
               
                  
                    <Dropdown
                    style={[styles.dropdown, isFocus && { borderColor: 'blue' }]}
                    placeholderStyle={styles.placeholderStyle}
                    selectedTextStyle={styles.selectedTextStyle}
                    inputSearchStyle={styles.inputSearchStyle}
                    data={categorias} 
                    search
                    maxHeight={300}
                    labelField="label"
                    valueField="value"
                    placeholder={!isFocus ? cat : '...'}
                    searchPlaceholder="Pesquisar..."
                    value={value}
                    onFocus={() => setIsFocus(true)}
                    onBlur={() => setIsFocus(false)}
                    onChange={item => {
                        setValue(item.value);
                        setIsFocus(false);
                        setCat(item.label);
                    }}
                    />
                    <StyleCardButtons>
                    <StyledCardsButton cancel={true} >
                      <ButtonText cancel={true}>Cancelar</ButtonText>
                    </StyledCardsButton>
                    <StyledCardsButton onPress={handleSaveCard} >
                      <ButtonText>Guardar</ButtonText>
                    </StyledCardsButton>
                    </StyleCardButtons>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};


export default Cartao;
const styles = StyleSheet.create({
    container: {
      backgroundColor: branco,
      padding: 16,
    },
    dropdown: {
      height: 50,
      width: 350,
      borderColor: letras,
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      backgroundColor: branco,
      paddingLeft: 20,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 20,
    },
    placeholderStyle: {
      fontSize: 20,
      color: letras,
      
    },
    selectedTextStyle: {
      fontSize: 20,
      color: letras,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 20,
    },
    cameraContainer: {
      flex: 1,
      flexDirection: 'column',
      backgroundColor: 'black',
  },
  camera: {
      flex: 1,
  },
  cameraButton: {
      position: 'absolute',
      bottom: 20,
      alignSelf: 'center',
      backgroundColor: '#fff',
      padding: 20,
      borderRadius: 50,
  },
  cameraButtonText: {
      fontSize: 20,
  },
  capturedPhoto: {
      width: 200,
      height: 200,
      alignSelf: 'center',
      marginTop: 10,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },

  });