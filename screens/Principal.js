import React,{useState, useEffect} from "react";
import { StatusBar } from 'expo-status-bar';
import { useIsFocused } from '@react-navigation/native';
import {Formik} from 'formik';
import {View, TouchableOpacity, ActivityIndicator, Text} from 'react-native';

import { useNavigation } from '@react-navigation/native';

//icons
import {Octicons, Ionicons, Fontisto} from '@expo/vector-icons';

//colors
import {Colors} from './../components/styles';

import { db,auth} from '../firebase';

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
    DisplayCard,
    LojaLogo,
    StyleCardText,
    CardDisplayText  
} from './../components/styles'

//colors
const{texto,darkLight,verde} = Colors;

//keyboard avoiding view
import KeyboardAvoidingWrapper from '../components/KeyoardAvoidingWrapper';


const Principal =() => {

    const [userCards, setUserCards] = useState([]);
    const [user, setUser] = useState(null);
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const [recentUserCards, setRecentUserCards] = useState([]);
   
   
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
            fetchUserCards(user.currentProfile);
        }
    }, [user]); 
    
    const fetchUserCards = async (currentProfileId) => {
        try {
            const userCardsRef = db.collection('cards').where('createdBy', '==', currentProfileId);
            const snapshot = await userCardsRef.get();
            const userCardsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserCards(userCardsData);
            const recentCards = userCardsData.slice(0, 5);
            setRecentUserCards(recentCards);
        } catch (error) {
            console.error('Erro ao buscar os cartões do usuário:', error);
        }
    };

    const navigateToCategoryPage = (categoryName, cor, icone) => {
        navigation.navigate('Categorias', { categoryName, cor, icone });
    };

    const navigateToCard = (id, name, img, barcodeData, frontImage, backImage, category) => {
        if (category === 'Banco' || category === 'Identificação') {
            navigation.navigate("CardSelectId", { id, name, img, frontImage, backImage, category });
        } else {
            navigation.navigate('CardSelect', { id, name, img, barcodeData, frontImage, backImage, category });
        }
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer  principal={true}>
                <StatusBar style ="dark"/>
                <InnerContainer principal={true}>
                    <StyledTitle>
                    <PageTitle principal={true}> EzyCard</PageTitle> 
                    <PageLogo principal={true} source={require('../assets/img/Logo.png')} />
                    <Perfil onPress={() => navigation.navigate('PerfilPage')}>
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
                                onChangeText={handleChange('pesquisa')}
                                onBlur={handleBlur('pesquisa')}
                                values={values.pesquisa}
                            />
                           
                        </StyledFormArea>)}
                    </Formik>
                    <SubTitle principal={true}>Categorias:</SubTitle>
                    < StyledCategory >
                    <CategoryContainer >
                        <Category hiper = {true} onPress={() => navigateToCategoryPage('Hipermercado','#427BC8',<Fontisto name="shopping-basket" color="#427BC8" size={25} />)}>
                            <Fontisto name="shopping-basket" color="#427BC8" size={25} />
                        </Category>
                        <CategoryText>Hipermercado</CategoryText>

                        <Category desporto = {true} onPress={() => navigateToCategoryPage('Desporto','#C84242',<Fontisto name="bicycle" color="#C84242" size={25}/>)}>
                            <Fontisto name="bicycle" color="#C84242" size={25}/>
                        </Category>
                        <CategoryText>Desporto</CategoryText>

                    </CategoryContainer>
                    <CategoryContainer>
                        <Category banco = {true} onPress={() => navigateToCategoryPage('Banco','#C842C3',<Fontisto name="credit-card" color="#C842C3" size={20}/>)}>
                            <Fontisto name="credit-card" color="#C842C3" size={20}/>
                        </Category>
                        <CategoryText>Banco</CategoryText>

                        <Category tech = {true} onPress={() => navigateToCategoryPage('Tecnologia','#FF8A00',<Fontisto name="desktop" color="#FF8A00" size={25}/>)}>
                            <Fontisto name="desktop" color="#FF8A00" size={25}/>
                        </Category>
                        <CategoryText>Tecnologia</CategoryText>

                    </CategoryContainer>
                    <CategoryContainer>
                        <Category roupa = {true} onPress={() => navigateToCategoryPage('Roupa','#F9D22D',<Fontisto name="shopping-bag" color="#F9D22D" size={25}/>)}>
                            <Fontisto name="shopping-bag" color="#F9D22D" size={25}/>
                        </Category>
                        <CategoryText>Roupa</CategoryText>

                        <Category brico = {true} onPress={() => navigateToCategoryPage('Bricolagem',"#36D9D8",<Octicons name="tools" color="#36D9D8" size={25}/>)}>
                            <Octicons name="tools" color="#36D9D8" size={25}/>
                        </Category>
                        <CategoryText>Bricolagem</CategoryText>

                    </CategoryContainer>
                    <CategoryContainer>
                        <Category idt = {true} onPress={() => navigateToCategoryPage('Identificação',"#8C6047",<Octicons name="id-badge" color="#8C6047" size={25}/>)}>
                            <Octicons name="id-badge" color="#8C6047" size={25}/>
                        </Category>
                        <CategoryText>Identificação</CategoryText>

                        <Category lazer = {true} onPress={() => navigateToCategoryPage('Lazer',"#8D42C8",<Octicons name="book" color="#8D42C8" size={25}/>)}>
                            <Octicons name="book" color="#8D42C8" size={25}/>
                        </Category>
                        <CategoryText>Lazer</CategoryText>

                    </CategoryContainer>
                    <CategoryContainer>
                        <Category transporte = {true} onPress={() => navigateToCategoryPage('Transporte',"#39B226",<Fontisto name="car" color="#39B226" size={25}/>)}>
                            <Fontisto name="car" color="#39B226" size={25}/>
                        </Category>
                        <CategoryText>Transporte</CategoryText>

                        <Category outros = {true} onPress={() => navigation.navigate('Outras')}>
                            <Octicons name="kebab-horizontal" color="#7E7E7E" size={25}/>
                        </Category>
                        <CategoryText>Outros</CategoryText>
                        
                    </CategoryContainer>
                    
                    </StyledCategory>
                    <SubTitle principal={true}>Usados recentemente:</SubTitle>
                    {recentUserCards.map((card, index) => (
                    <DisplayCard key={index} onPress={() => navigateToCard(card.id,card.name,card.logoImage,card.barcodeData,card.frontImage,card.backImage,card.category)}>
                    <LojaLogo displayCard={true} source={{ uri: card.logoImage }}  />
                    <StyleCardText>
                        <CardDisplayText>{card.name}</CardDisplayText>
                        <CardDisplayText category={true}>{card.category}</CardDisplayText>
                    </StyleCardText>
                </DisplayCard>
            ))}
                   
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

export default Principal;
