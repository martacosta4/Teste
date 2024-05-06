import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/core';
import { auth,provider } from '../firebase';
import { GoogleAuthProvider, signInWithCredential, signInWithRedirect} from 'firebase/auth';
import * as Linking from 'expo-linking';

import * as Google from 'expo-auth-session/providers/google';

import { Colors } from '../components/styles';
import { Octicons, Ionicons, Fontisto } from '@expo/vector-icons';

import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';


import AsyncStorage from '@react-native-async-storage/async-storage';

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
  TextLinkContent
} from '../components/styles';

const { texto, darkLight, verde } = Colors;

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [messageType, setMessageType] = useState();
  const [message, setMessage] = useState();
  const [value,setValue] = useState();

  const navigation = useNavigation();

  const [req,res,promptAsync]= Google.useAuthRequest({
    androidClientId: `697083015622-em406ejlbhpc7qc3dq4gdcvkut5vn040.apps.googleusercontent.com`,
  });

  useEffect(()=>{
    if(res?.type=="success"){
      const {id_token} = res.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth,credential);
    }
  },[])

  const handleLogin = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
        navigation.navigate("MainTabs");
        console.log('Logged in with:', user.email);
      })
      .catch(error => {
        // Captura e trata diferentes tipos de erros
        switch (error.code) {
          case 'auth/invalid-email':
            setMessageType('error');
            setMessage('O email fornecido é inválido.');
            break;
          case 'auth/user-disabled':
            setMessageType('error');
            setMessage('Esta conta foi desativada.');
            break;
          case 'auth/invalid-credential':
            setMessageType('error');
            setMessage('Email ou palavra-passe incorretos.');
            break;
          case 'auth/wrong-password':
            setMessageType('error');
            setMessage('A palavra-passe fornecida está incorreta.');
            break;
          default:
            setMessageType('error');
            setMessage('Ocorreu um erro ao fazer login. Por favor, tente novamente mais tarde.');
        }
      });
  };



  return (
    <KeyboardAvoidingWrapper>
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageLogo resizeMode="cover" source={require('../assets/img/Logo.png')} />
        <PageTitle> EzyCard </PageTitle>
        <SubTitle>Iniciar Sessão</SubTitle>
        <StyledFormArea>
          <MyTextInput
            icon="mail"
            placeholder="Email"
            placeholderTextColor={darkLight}
            onChangeText={text => setEmail(text)}
            values={email}
            keyboardType="email-address"
          />
          <MyTextInput
            icon="lock"
            placeholder="Password"
            placeholderTextColor={darkLight}
            onChangeText={text => setPassword(text)}
            values={password}
            secureTextEntry={hidePassword}
            isPassword={true}
            hidePassword={hidePassword}
            setHidePassword={setHidePassword}
          />
          <TouchableOpacity onPress={() => navigation.navigate('Other')}>
            <ButtonLink>Esqueceu-se da password?</ButtonLink>
          </TouchableOpacity>

          <MsgBox type={messageType}>{message}</MsgBox>
          
          <StyledButton onPress={handleLogin}>
            <ButtonText>Login</ButtonText>
          </StyledButton>
          
          <StyledButton google={true} onPress={()=>promptAsync()}>
            <Fontisto name="google" color={verde} size={25} />
            <ButtonText google={true}>Iniciar sessão com Google</ButtonText>
          </StyledButton>

          <ExtraView>
            <ExtraText>Ainda não tem conta? </ExtraText>
            <TextLink onPress={() => navigation.navigate('Registo')}>
              <TextLinkContent>Registe-se</TextLinkContent>
            </TextLink>
          </ExtraView>
        </StyledFormArea>
      </InnerContainer>
    </StyledContainer>
  </KeyboardAvoidingWrapper>
  );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
  return (
    <View>
      <LeftIcon>
        <Octicons name={icon} size={25} color={texto} />
      </LeftIcon>
      <StyledInputLabel>{label}</StyledInputLabel>
      <StyledTextInput {...props} />
      {isPassword && (
        <RightIcon onPress={() => setHidePassword(!hidePassword)}>
          <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={25} color={texto} />
        </RightIcon>
      )}
    </View>
  );
};

export default Login;
