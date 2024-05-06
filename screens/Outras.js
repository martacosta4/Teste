import React,{useState,useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import ImageList from "./ImageList";

import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator,FlatList,Image, StyleSheet,Modal,TextInput} from 'react-native';

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
    Filter,
    StyleCardButtons   
} from './../components/styles'

//colors
const{texto,darkLight,verde,letras} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Outras =() => {

  const [userCards, setUserCards] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  
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
    if (user && user.currentProfile) {
        fetchUserCat(user.currentProfile);
    }
}, [user]);

const fetchUserCat = async (currentProfileId) => {
    try {
        const userCardsRef = db.collection('categorias').where('createdBy', '==', currentProfileId);
        const snapshot = await userCardsRef.get();
        const userCardsData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setUserCards(userCardsData);
    } catch (error) {
        console.error('Erro ao buscar os categorias do usuário:', error);
    }
};


  const handleAddCategory = () => {
      setModalVisible(true);
  };

  const handleSaveCategory = () => {
    const userId = auth.currentUser.uid;
    db.collection('categorias').add({
        name: newCategoryName,
        createdBy: user.currentProfile
    }).then(() => {
        setNewCategoryName('');
        setModalVisible(false);
    }).catch(error => {
        console.error("Erro ao adicionar categoria: ", error);
    });
};

const handleCategoryPress = (categoryName) => {
    navigation.navigate('OutrasCat', { categoryName });
};

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer principal={true}>
                    <StyledTitle>
                    <PageTitle principal={true}> Outras categorias:</PageTitle> 
                    <Perfil others={true}>
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
                    {userCards.map((card, index) => (
                    <StyledLista cat ={true} key={index} onPress={()=> handleCategoryPress(card.name)}>
                        <ListText>{card.name}</ListText>
                    </StyledLista>
            ))}

                   
                   <DisplayCard add={true} onPress={handleAddCategory}>
                    <ButtonText add={true}>+ Adicionar categoria</ButtonText>
                   </DisplayCard>

                   <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <SubTitle filter={true}>Nome da nova categoria:</SubTitle>
                            <TextInput
                                style={styles.input}
                                placeholder="Inserir nome"
                                value={newCategoryName}
                                onChangeText={text => setNewCategoryName(text)}
                            />
                            <StyleCardButtons cat={true}>
                            <StyledButton google={true} onPress={() => setModalVisible(false)}>
                                <ButtonText cancel={true}>Cancelar</ButtonText>
                            </StyledButton >
                            <StyledButton save={true} onPress={handleSaveCategory}>
                                <ButtonText>Salvar</ButtonText>
                            </StyledButton>
                            </StyleCardButtons>
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

 
export default Outras;

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    input: {
        height: 45,
        width: 300,
        borderColor: letras,
        borderRadius: 10,
        borderWidth: 1,
        marginBottom: 20,
        padding: 10,
        fontSize: 19,
    },
    saveButton: {
        backgroundColor: verde,
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginBottom: 10
    },
    cancelButton: {
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: verde,
        borderWidth: 1,
        padding: 10,
        elevation: 2,
    },
    
});


