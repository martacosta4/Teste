import React,{useState,useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageList from "./ImageList";

import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator,FlatList,Image, StyleSheet,Modal,Text} from 'react-native';

import { db,auth} from '../firebase';

import { useIsFocused } from '@react-navigation/native';

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
    ListText,
    DisplayCard,
    LojaLogo,
    StyleCardText,
    CardDisplayText,
    Filter   
} from './../components/styles'

//colors
const{texto,darkLight,verde,letras} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';

import { useNavigation } from '@react-navigation/native';


const OutrasCat =({route}) => {
  const {categoryName} = route.params;
  const isFocused = useIsFocused();
  const [userCards, setUserCards] = useState([]);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);


  const navigation = useNavigation();

  useEffect(() => {
    const loadCurrentProfile = async () => {
        try {
            const profile = await AsyncStorage.getItem('currentProfile');
            if (profile) {
                setCurrentProfile(JSON.parse(profile));
            }
        } catch (error) {
            console.error('Erro ao carregar o perfil atual:', error);
        }
    };
    loadCurrentProfile();
}, [isFocused]);

  const handleFilterSelect = (filter) => {
    setSelectedFilter(filter);
    setModalVisible(false); // Fechar o modal após selecionar o filtro
  
    if (filter === 'alfa') {
        // Ordenar os cartões por ordem alfabética
        setUserCards([...userCards].sort((a, b) => (a.name > b.name) ? 1 : -1));
    }
  
    if (filter === 'cat') {
      // Ordenar os cartões por ordem alfabética
      setUserCards([...userCards].sort((a, b) => (a.category > b.category) ? 1 : -1));
  }
  if (filter === 'rec') {
    // Ordenar os cartões por ordem alfabética
    setUserCards([...userCards].sort((a, b) => (a.date < b.date) ? 1 : -1));
  }
  };

  useEffect(() => {
    // Se o filtro estiver selecionado, você pode aplicá-lo à sua busca no Firestore aqui
}, [selectedFilter,isFocused]); // Adicione selectedFilter como dependência para que a busca seja atualizada quando o filtro mudar


  useEffect(() => {
    // Função para buscar os cartões associados ao perfil atual
    const fetchUserCards = async () => {
        // Obter o ID do perfil atualmente autenticado
        if(currentProfile){
        // Consultar o Firestore para obter os cartões associados a esse perfil
        const userCardsRef = db.collection('cards').where('category', '==', categoryName,'AND','createdBy', '==', currentProfile.id);

        
        const snapshot = await userCardsRef.get();

        // Mapear os documentos da consulta para obter os dados dos cartões
        const userCardsData = snapshot.docs.map(doc => doc.data());

        // Atualizar o estado com os cartões encontrados
        setUserCards(userCardsData);
    }
    };

    fetchUserCards(); // Chamar a função para buscar os cartões ao montar o componente
}, [isFocused]);
   
const styles = StyleSheet.create({
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
},
})
    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer principal={true}>
                    <StyledTitle>
                    <PageTitle principal={true}> Categoria:</PageTitle> 
                    <Perfil cat={true}>
                        <Octicons name="person" color={texto} size={25}/>
                    </Perfil>
                    </StyledTitle>
                    <StyledTitle cat ={true}>
                    <SubTitle principal={true}>{categoryName}</SubTitle>
                    <Filter cat ={true} onPress={() => setModalVisible(true)}>
                        <Octicons name="filter" color={letras} size={28}/>
                    </Filter>
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
                    {userCards.map((card, index) => (
                    <DisplayCard cat ={true} key={index}>
                    <LojaLogo displayCard={true} source={{ uri: card.logoImage }}  />
                    <StyleCardText>
                        <CardDisplayText>{card.name}</CardDisplayText>
                        <CardDisplayText category={true}>{card.category}</CardDisplayText>
                    </StyleCardText>
                </DisplayCard>
            ))}

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                              <SubTitle filter={true}>Ordenar por:</SubTitle>
                                <TouchableOpacity onPress={() => handleFilterSelect('alfa')}>
                                
                                <View style={styles.filterOption}>
                                        {selectedFilter === 'alfa' ? (
                                          <Fontisto name="checkbox-active" size={20}/>
                                        ) : (
                                          <Fontisto name="checkbox-passive" size={20}/>
                                        )}
                                        <Text style={{ fontSize: 18, marginLeft:10  }}>Ordem alfabética</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleFilterSelect('rec')}>
                                <View style={styles.filterOption}>
                                        {selectedFilter === 'rec' ? (
                                            <Fontisto name="checkbox-active" size={20}/>
                                        ) : (
                                          <Fontisto name="checkbox-passive" size={20}/>
                                        )}
                                        <Text style={{ fontSize: 18, marginLeft:10 }}>Adicionados recentemente</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                   
                    
                   
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

 
export default OutrasCat;


