import React,{useState,useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

import ImageList from "./ImageList";

import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator,FlatList,Image, StyleSheet,Modal,Text} from 'react-native';

import { db,auth} from '../firebase';

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





const Categorias =({route}) => {
  const {categoryName,cor,icone} = route.params;
  const [currentProfile, setCurrentProfile] = useState(null);
  const [userCards, setUserCards] = useState([]);
  const [user, setUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);

  const navigation = useNavigation();
  const isFocused = useIsFocused();
   

  useEffect(() => {
    const loadUserData = async () => {
        try {
            const userId = auth.currentUser.uid;
            const userRef = await db.collection('users').doc(userId).get();
            setUser(userRef.data());
        } catch (error) {
            console.error('Erro ao carregar os dados do usuário:', error);
        }
    };
    loadUserData();
}, [isFocused]);


  useEffect(() => {
    // Se o filtro estiver selecionado, você pode aplicá-lo à sua busca no Firestore aqui
}, [selectedFilter]); // Adicione selectedFilter como dependência para que a busca seja atualizada quando o filtro mudar

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
    if (user && user.currentProfile) {
        fetchUserCards(user.currentProfile);
    }
}, [user]);

const fetchUserCards = async (currentProfileId) => {
    try {
        const userCardsRef = db.collection('cards')
            .where('category', '==', categoryName) // Aqui está o primeiro filtro para a categoria
            .where('createdBy', '==', currentProfileId); // Aqui você deve adicionar outro filtro para o perfil atual

        const snapshot = await userCardsRef.get();
        const userCardsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUserCards(userCardsData);
    } catch (error) {
        console.error('Erro ao buscar os cartões do usuário:', error);
    }
};


   
const styles = StyleSheet.create({
  color: {
    color: cor
  },
  filterOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
},
})

const navigateToCard = (id,name,img,barcodeData,frontImage,backImage,category) => {
        
    if (category === 'Banco' || category=== 'Identificação') {
        navigation.navigate("CardSelectId", {id,name,img,frontImage,backImage,category });
      } else {
        navigation.navigate('CardSelect', {id,name,img,barcodeData,frontImage,backImage,category });
    }
};
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
                    <SubTitle principal={true} style={styles.color}>{categoryName} {icone}</SubTitle>
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
                    <DisplayCard cat ={true} key={index} onPress={() => navigateToCard(card.id,card.name,card.logoImage,card.barcodeData,card.frontImage,card.backImage,card.category)}>
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

 
export default Categorias;


