import React,{useState,useEffect} from "react";
import { StatusBar } from 'expo-status-bar';

import ImageList from "./ImageList";

import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator,FlatList,Image} from 'react-native';


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



const Lista =() => {
   
    
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer principal={true}>
                    <StyledTitle>
                    <PageTitle principal={true}> Escolher cartão:</PageTitle> 
                    <Perfil noIcon={true}>
                        <Octicons name="person" color={texto} size={25}/>
                    </Perfil>
                    </StyledTitle>
                    <Formik
                        initialValues={{pesquisa: ''}}
                    >
                        {({handleChange,handleBlur,handleSubmit,values, isSubmitting})=>(<StyledFormArea>
                            <MyTextInput
                                pesquisa={true}
                                icon = "search"
                                placeholder="Pesquisar cartão"
                                onChangeText={handleChange('pesquisa')}
                                onBlur={handleBlur('pesquisa')}
                                values={values.pesquisa}
                            />
                           
                        </StyledFormArea>)}
                    </Formik>

                    <ImageList />
                    
                   
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};
const MyTextInput = ({label, icon,...props}) => {
    return (
        <View>
            <LeftIcon pesquisa={true}>
                <Octicons name={icon} size={25} color={texto}/>
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props}/>
            
        </View>
    )
}


export default Lista;
