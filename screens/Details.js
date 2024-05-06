import React,{useState,useEffect} from "react";
import { StatusBar } from 'expo-status-bar';

import ImageList from "./ImageList";

import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator,FlatList,Image} from 'react-native';

import {db,auth} from '../firebase';

import { useNavigation } from '@react-navigation/native';


import { getStorage, ref,listAll, getDownloadURL } from "firebase/storage";

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//colors
import {Colors} from './../components/styles';

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
    StyledLista,
    ListLogo,
    ListText  
} from './../components/styles'

//colors
const{texto,darkLight,verde} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';



const Details =() => {
  const [info,setInfo] = useState();
  const [name,setName] = useState();
  const[surname, setSurname] = useState();
  const [email, setEmail] = useState();
  const [hidePassword, setHidePassword] = useState(true);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const navigation = useNavigation();

  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }
  
   
  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        await db.collection('users').doc(user.uid).get()
          .then((snapshot) => {
            if (snapshot.exists) {
              setInfo(snapshot.data());
              setName(snapshot.data().name);
              setSurname(snapshot.data().surname);
              setEmail(snapshot.data().email);
            } else {
              console.log('Utilizador não existe');
            }
          })
          .catch(error => console.error('Erro ao buscar dados do usuário:', error));
      }
    };
  
    fetchUserData();
  }, []);

  const handleChangePassword = async () => {
    try {
      // Validação das credenciais com a senha antiga
      const cred = auth.EmailAuthProvider.credential(
        email,
        oldPassword
      );
  
      await auth.currentUser.reauthenticateWithCredential(cred);
  
      // Se a validação for bem-sucedida, atualiza a senha
      await auth.currentUser.updatePassword(newPassword);
  
      alert("Palavra-passe alterada com sucesso!");
    } catch (error) {
      alert(error.message);
    }
  }
    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer principal={true}>
                    
                    <PageTitle principal={true}> Definições</PageTitle> 
                    <SubTitle principal={true}>Dados:</SubTitle>
                    
                    <Formik>
                       <StyledFormArea details={true}>
                        <MyTextInput
                            icon = "person"
                            placeholder={name}
                            placeholderTextColor={darkLight}
                            editable={false}
                            
                            
                        />
                        <MyTextInput
                            icon = "person"
                            placeholder={surname}
                            placeholderTextColor={darkLight}
                            editable={false}
                            
                           
                        />
                        <MyTextInput
                            icon = "mail"
                            placeholder={email}
                            placeholderTextColor={darkLight}
                            editable={false}
                            
                        />
                        <SubTitle details={true}>Alterar Palavra-passe:</SubTitle>
                          <MyTextInput
                              icon = "lock"
                              placeholder="Palavra-passe antiga"
                              placeholderTextColor={darkLight}
                              secureTextEntry={hidePassword}
                              isPassword={true}
                              hidePassword={hidePassword}
                              setHidePassword={setHidePassword}
                              onChangeText={(text) => setOldPassword(text)}
                              
                          />
                          <MyTextInput
                              icon = "lock"
                              placeholder="Palavra-passe nova"
                              placeholderTextColor={darkLight}
                              secureTextEntry={hidePassword}
                              isPassword={true}
                              hidePassword={hidePassword}
                              setHidePassword={setHidePassword}
                              onChangeText={(text) => setNewPassword(text)}
                              
                          />

                        <StyledButton onPress={handleChangePassword}>
                            <ButtonText>Guardar</ButtonText>
                        </StyledButton>
                        
                        <StyledButton logout={true} onPress={handleSignOut}>
                            <ButtonText >Terminar sessão</ButtonText>
                        </StyledButton>
                   
                    </StyledFormArea>
                    </Formik>

                    
                    
                   
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};
const MyTextInput = ({label,  editable = true,icon,...props}) => {
  return (
      <View>
          <LeftIcon>
              <Octicons name={icon} size={25} color={texto}/>
          </LeftIcon>
          <StyledInputLabel>{label}</StyledInputLabel>
          <StyledTextInput {...props}
          editable={editable}
          selectable={false}
          />
      </View>
  )
}


export default Details;
