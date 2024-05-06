import React,{useState} from "react";
import { StatusBar } from 'expo-status-bar';

import {Formik} from 'formik';
import {View, TouchableOpacity,ActivityIndicator,Alert} from 'react-native';

import { useNavigation } from '@react-navigation/native';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//colors
import {Colors} from '../components/styles';

import { db,auth} from '../firebase';


import { getDatabase, ref, set } from "firebase/database";


import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';

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
    Line, 
    ExtraText,
    ExtraView,
    TextLink,
    TextLinkContent,
    MsgBox  
} from '../components/styles'

//colors
const{texto,darkLight,verde} = Colors;




const Registo =() => {
    const [hidePassword, setHidePassword] = useState(true);
    
    const [message,setMessage]=useState();
    const [messageType,setMessageType] = useState();

    const [name,setName]=useState();
    const [surname,setSurname]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    const nav = useNavigation();

  
    registerUser = async (name, surname, email,password) => {
        await auth.createUserWithEmailAndPassword(email, password)
        .then(()=>{
            auth.currentUser.sendEmailVerification({
                handleCodeInApp: true,
                url :'https://ezycard-e098d.firebaseapp.com',
                
            })
            .then(()=>{
                alert('Email de verificação enviado')
            }).catch((error)=>{
                alert(error.message)
            })
            .then(()=>{
                const currentProfile = auth.currentUser.uid;
                db.collection('users')
                .doc(auth.currentUser.uid)
                .set({
                    name,
                    surname,
                    email,
                    currentProfile,
                })
                const userId = auth.currentUser.uid;
                db.collection('perfil')
                .doc(auth.currentUser.uid)
                .set({
                    name,
                    surname,
                    userId,
                })
            })
            .catch((error)=>{
                alert(error.message)
            })
        }).catch((error)=>{
            alert(error.message)
        })
    }
 
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style ="dark"/>
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require('../assets/img/Logo.png')} />
                    <PageTitle> EzyCard </PageTitle> 
                    <SubTitle>Registar</SubTitle>
                    <Formik
                    >
                        {({handleChange,handleBlur,handleSubmit,values, isSubmitting})=>(<StyledFormArea>
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
                            <MyTextInput
                                icon = "mail"
                                placeholder="Email"
                                placeholderTextColor={darkLight}
                                onChangeText={(email) => setEmail(email)}
                                values={email}
                                keyboardType= "email-address"
                            />
                            <MyTextInput
                                icon = "lock"
                                placeholder="Password"
                                placeholderTextColor={darkLight}
                                onChangeText={(password) => setPassword(password)}
                                values={password}
                                secureTextEntry={hidePassword}
                                isPassword={true}
                                hidePassword={hidePassword}
                                setHidePassword ={setHidePassword}
                            />
                            <MsgBox type={messageType}>{message}</MsgBox>
                            {!isSubmitting &&(
                            <StyledButton onPress={() =>registerUser(name,surname,email,password)}>
                                <ButtonText>Registar</ButtonText>
                            </StyledButton>
                            )}

                            {isSubmitting &&(<StyledButton disabled={true}>
                                <ActivityIndicator size ="large" color={texto}/>
                            </StyledButton>)}

                            <ExtraView>
                                <ExtraText>Já tem conta? </ExtraText>
                                <TextLink>
                                    <TextLinkContent onPress={()=>nav.replace("Login")}>Login</TextLinkContent>
                                </TextLink>
                            </ExtraView>                     
                        </StyledFormArea>)}
                    </Formik>
                            
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({label, icon,isPassword,hidePassword,setHidePassword,...props}) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={25} color={texto}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={25} color={texto}/>
                </RightIcon>
            )}
            
        </View>
    )
}
export default Registo;


