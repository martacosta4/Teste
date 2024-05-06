import React,{useState, useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import { Dropdown } from 'react-native-element-dropdown';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import { useNavigation } from '@react-navigation/native';


import {View, TouchableOpacity,StyleSheet, Image} from 'react-native';

import { Camera} from 'expo-camera';

//icons
import {Octicons} from '@expo/vector-icons';

//colors
import {Colors} from './../components/styles';

import { db, auth } from '../firebase';

import {
    StyledContainer,
    InnerContainer,
    SubTitle,
    StyledFormArea,
    StyledTextInput,
    ButtonText,
    StyledBarras,
    StyledPhotos,
    PhotoText,
    StyledPhotosButtons,
    StyleCardButtons,
    StyledCardsButton,
    CardPhoto  
} from './../components/styles'

//colors
const{darkLight, branco,letras} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';


const CardSelectId =({ route}) => {
    const {id,name,img,frontImage,backImage, category } = route.params;
    const [value, setValue] = useState(null);
    const [isFocus, setIsFocus] = useState(false);
    const [categorias, setCategorias] = useState([]);
    const [hasPermission, setHasPermission] = useState(null);
    
    const [cardName, setCardName] = useState(null);

    const navigation = useNavigation();
    
    const [fullScreenImageUri, setFullScreenImageUri] = useState(null);
    const [showFullScreenImage, setShowFullScreenImage] = useState(false);


    const [imageFront, setImageFront] = useState(null);
    const [imageBack, setImageBack] = useState(null);

    const [categoria, setCat] = useState(null);

  
    

    const handleShowFullScreenImage = (imageUri) => {
      setFullScreenImageUri(imageUri);
      setShowFullScreenImage(true);
    };
    
    const handleSaveCard = () => {
        const cardData = {
            name: name,
            logoImage: img,
            frontImage: frontImage,
            backImage: backImage, 
            category: categoria, 
            createdBy: auth.currentUser.uid
        };
    
        
        db.collection('cards').doc(id).update(cardData)
        .then(() => {
            console.log('Cartão atualizado com sucesso!');
            navigation.navigate('MainTabs');
        })
        .catch((error) => {
            console.error('Erro ao atualizar o cartão:', error);
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
                value: doc.id,
            }));
            setCategorias(categoriasData);
            
            

        });

        return () => unsubscribe();
    }, []);

    const handleRemoveCard = async (cardId) => {
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
                  onPress: () => removeCard(cardId)
              }
          ]
      );
  };

  const removeCard = async (cardId) => {
      try {
          await db.collection('cards').doc(cardId).delete();
          console.log('Cartão removido com sucesso!');
          navigation.navigate('MainTabs');
      } catch (error) {
          console.error('Erro ao remover cartão:', error);
      }
  };

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
                    
                <StyledFormArea>
                            <MyTextInput
                                placeholder={name}
                                placeholderTextColor={darkLight}
                                onChangeText={(name) => setCardName(name)}
                                values={cardName}
                            />                                              
                        </StyledFormArea>
                    <StyledBarras >
                    <SubTitle>Fotos do cartão</SubTitle>
                    <StyledPhotosButtons>
                    
                    {frontImage ? ( 
                    <CardPhoto source={{ uri: frontImage }} onPress={() => handleShowFullScreenImage(frontImage)} />
                      ):(
                      <StyledPhotos onPress={pickImageFront}>
                        <Octicons name="device-camera" size={30}/>
                        <PhotoText>FRENTE</PhotoText> 
                      </StyledPhotos>
                    )}
                    
                    {backImage ? ( 
                    <CardPhoto source={{ uri: backImage }}/>
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
                    placeholder={!isFocus ? category : '...'}
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
                      <ButtonText cancel={true} onPress={handleRemoveCard}>Remover</ButtonText>
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

const MyTextInput = ({...props}) => {
  return (
      <View>
          <StyledTextInput cardId={true} {...props}/>            
      </View>
  )
}

export default CardSelectId;

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