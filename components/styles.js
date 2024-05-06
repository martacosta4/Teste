import styled from 'styled-components/native';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';


const StatusBarHeight = Constants.statusBarHeight;
//cores
export const Colors = {
    fundo: '#F5F5F5',
    letras: '#57604B',
    verde: '#60941A',
    branco: '#FFFFFF',
    texto: '#94AFB6',
    vermelho: '#FF0000'
};

const {fundo, verde, branco,letras,texto,vermelho} = Colors;
export const StyledContainer = styled.View`
    flex: 1;
    padding: 25px;
    padding-top:${StatusBarHeight +30}px;
    background-color:${fundo};

    ${(props) => props.principal == true &&`
     padding: 10px 0px;
     padding-top:${StatusBarHeight +20}px;
   `}
   
`;
export const InnerContainer = styled.View`
    flex: 1;
    width: 100%;
    align-items: center;

    ${(props) => props.principal == true &&`
     align-items: left;
     `}

`;
export const PageLogo = styled.Image`
    width: 200px;
    height:150px;

    ${(props) => props.principal == true &&`
     width: 60px;
     height:35px;
     margin-top:14px;
    `}
`;
export const PageTitle = styled.Text`
    font-size: 35px;
    text-align: center;
    font-weight: bold;
    color:${letras};
    padding: 10px;

    ${(props) => props.principal == true &&`
     font-size:30px;
     font-weight: bold;
     color:${letras};
     text-align: left;
     padding:13px 2px;
     `}
`;

export const SubTitle = styled.Text`
    font-size: 25px;
    margin-top: 10px;
    margin-bottom: 15px;
    letter-spacing: 1px;
    font-weight: bold;
    color:${letras};

    ${(props) => props.principal == true &&`
    padding-left:10px;
    `}
    ${(props) => props.cart == true &&`
    margin-right:55%; 
    `}
    ${(props) => props.filter == true &&`
    margin-top:0px; 
    font-size: 22px;
    `}
    ${(props) => props.perfil == true &&`
    font-size: 30px;
    `}
    ${(props) => props.mudarPerfil == true &&`
    margin-right:45%;
    `}
    ${(props) => props.createPerfil == true &&`
    margin-right:45%;
    margin-top:40px;

    `}

    ${(props) => props.details == true &&`
    margin-top:15px; 
    font-size: 22px;
    `}
`;
export const StyledFormArea = styled.View`
    width: 90%;
    ${(props) => props.details == true &&`
    margin-left:5%;
    `}
`;

export const StyledTextInput = styled.TextInput`
    background-color:${branco};
    padding: 15px;
    padding-left: 55px;
    padding-right: 55px;
    border-radius: 10px;
    font-size: 16px;
    height: 60px;
    color: ${letras};

    ${(props) => props.pesquisa == true &&`
     border-radius: 30px;
     height: 40px;
     width: 105%;
     margin-top: -10px;
     margin-left:10px;
     font-size: 12px;
     padding: 1px;
     padding-left: 35px;
     padding-right: 35px;
     
    `}
    ${(props) => props.cardId == true &&`
     font-size:20px;
     text-align:center;
     margin-top:60px;
     padding:0px;
    `}
`;

export const StyledInputLabel = styled.Text`
    color: ${letras};
    font-size: 13px;
    text-align: left;
`;

export const LeftIcon = styled.View`
    left: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;

    ${(props) => props.pesquisa == true &&`
     left: 20px;
     top: 15px;
    `}
`;

export const RightIcon = styled.TouchableOpacity`
    right: 15px;
    top: 38px;
    position: absolute;
    z-index: 1;
`;

export const StyledButton = styled.TouchableOpacity`
    padding: 15px;
    background-color:${verde};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    margin-top: 25px;
    height: 60px;

    ${(props) => props.google == true &&`
     background-color: ${branco}; 
     border:2px ${verde};
     flex-direction: row;
     justify-content: center;
     margin-top: 5px;
     `}

     
    ${(props) => props.save == true &&`
    flex-direction: row;
    justify-content: center;
    margin-top: 5px;
    padding:5px 25px;
    margin-left: 50px;
    `}
    
    ${(props) => props.createPerfil == true &&`
    flex-direction: row;
    justify-content: center;
    margin-top: 5px;
    padding:5px 25px;
    margin-left: 110px;
    `}

    ${(props) => props.logout == true &&`
    background-color: #E72929; 
    
    `}
`;

export const ButtonText = styled.Text`
    color: ${branco};
    font-size: 20px;
    ${(props) => props.google == true &&`
     color: ${verde};
     font-size: 15px;
     padding-left: 15px;
     
     `}

     ${(props) => props.cancel == true &&`
     color: ${verde};
     font-size: 20px;
     `}

     ${(props) => props.add == true &&`
     font-size: 23px;
     margin-left:13%;
     `}
     ${(props) => props.addPerfil == true &&`
     font-size: 23px;
     margin-left:70px;
     `}

`;

export const ButtonLink = styled.Text`
    color: ${verde};
    font-size: 16px;
    font-weight: bold;
    padding: 5px;
    padding-top: 15px;
`;

export const MsgBox = styled.Text`
    text-align: center;
    font-weight: bold;
    font-size: 15px;
    padding-top: 15px;
    color: ${(props) => (props.type == 'SUCESS' ? verde : vermelho)};
`;

export const Line = styled.View`
    height: 1px;
    width: 100%;
    background-color:${texto};
    margin-vertical: 10px;
`;

export const ExtraView = styled.View`
    justify-content: center;
    flex-direction: row;
    align-items: center;
    padding: 10px;
`;

export const ExtraText = styled.Text`
    justify-content: center;
    align-items:center;
    color: ${letras};
    font-size:15px;

`;

export const TextLink = styled.TouchableOpacity`
    justify-content: center;
    align-items: center;
`;

export const TextLinkContent = styled.Text`
    color: ${verde};
    font-size:15px;
    font-weight: bold;
`;
export const StyledTitle = styled.View`
    width: 100%;
    height: 80px;
    flex-direction: row;
    padding-top: 10px;


    ${(props) => props.cat == true &&`
    padding-top: 0px;
    margin-bottom: -25px;
    `}
`;
export const Perfil = styled.TouchableOpacity`
    background-color:${branco};
    width: 40px;
    height: 40px;
    border-radius: 50px;
    padding:5px;
    align-items: center;
    margin-left:35%;
    margin-top:15px;
    

    ${(props) => props.noIcon == true &&`
     margin-left:19%;
    
    `}
    ${(props) => props.cat == true &&`
    margin-left:42%;
   `}
   ${(props) => props.others == true &&`
    margin-left:10%;
   `}


`;

export const StyledCategory = styled.View`
    padding: 20px;
    padding-left:15px;
    margin-left:10px;
    width: 95%;
    height: 180px;
    background-color:${branco};
    border-radius: 20px;
    flex-direction: row;
`;

export const Category = styled.TouchableOpacity`
    background-color:${branco};
    width: 40px;
    height: 40px;
    border-radius: 50px;
    align-items: center;
    justify-content: center;
    text-align: center;
    ${(props) => props.hiper == true &&`
     background-color: #D9E5F4;
    `}
    ${(props) => props.banco == true &&`
    background-color: #F4D9F1;
   `}
   ${(props) => props.roupa == true &&`
     background-color: #FEFAD8;
    `}
    ${(props) => props.idt == true &&`
    background-color: #CBBFB2;
   `}
   ${(props) => props.transporte == true &&`
    background-color: #CDFBC9;
   `}
   ${(props) => props.desporto == true &&`
    background-color: #FAC8C5;
   `}
   ${(props) => props.tech == true &&`
    background-color: #FFEBD4;
   `}
   ${(props) => props.brico == true &&`
    background-color: #D2FFFF;
   `}
   ${(props) => props.lazer == true &&`
   background-color: #E4AFF6;
  `}
  ${(props) => props.outros == true &&`
  background-color: #EBEBED;
 `}
`;
export const CategoryText = styled.Text`
    color: ${letras};
    font-size: 10px;
    padding-top:5px;
    padding-bottom: 8%;
    
`;

export const CategoryContainer = styled.View`
    align-items: center;
    padding-right: 3%;
    
`;


export const StyledLista = styled.TouchableOpacity`
    margin-top: 20px;
    padding: 20px;
    padding-left:15px;
    width: 95%;
    height: 50px;
    background-color:${branco};
    border-radius: 20px;
    flex-direction: row;

    ${(props) => props.cat == true &&`
        margin-left:10px;
    `}
    ${(props) => props.addPerfil == true &&`
        background-color:${verde};
       

    `}
   
`;


export const ListLogo = styled.Image`
    width: 42px;
    height:42px;
    margin-top:-15px;
`;

export const ListText = styled.Text`
    font-size: 20px;
    color:${letras};
    width: 310px;
    height: 50px;
    margin-top: -15px;
    text-align: center;
    padding-top: 5px;
    
`;

export const LojaLogo = styled.Image`
    width: 100px;
    height: 100px;
    margin-top:50px;
    margin-bottom:10px;
    padding:40px;

    ${(props) => props.displayCard == true &&`
    margin-top:10px;
    padding:0px;
    `}
`;

export const StyledBarras = styled.View`
    padding-left: 15px;
    width: 95%;
    height: 180px;
    background-color:${branco};
    border-radius: 20px;
    margin-top:20px;

    ${(props) => props.barras == true &&`
    align-items:center;
    padding-left:0px;
    padding-top:20px;
    `}
   
`;
export const StyledPhotosButtons = styled.View`
    flex-direction:row;
   
`;

export const StyledPhotos = styled.TouchableOpacity`
    padding: 20px;
    width: 150px;
    height: 100px;
    background-color:${fundo};
    border-radius: 20px;
    flex-direction:column;
    align-items: center;
    margin-right: 25px;

    ${(props) => props.perfil == true &&`
     background-color:${branco};
     padding-top: 50px;
     width: 150px;
     height: 150px;
     border-radius: 75px;
     align-items: center;
     margin-top: 60px;
     margin-right: 13px;
     border:1px;
     border-color:${letras};
    `}
`;

export const PhotoText = styled.Text`
    font-size: 15px;
    color:${letras};
    padding-top: 10px;
        
`;

export const StyleCardButtons = styled.View`
    flex-direction:row; 
    align-items:center;
    width: 90%;

    ${(props) => props.cat == true &&` 
    width: 300px;
    padding-left:10px;

    `}
    ${(props) => props.perfil == true &&` 
    margin-top:55%;

    `}
`;

export const StyledCardsButton = styled.TouchableOpacity`
    padding: 15px;
    background-color:${verde};
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    margin-vertical: 5px;
    margin-top: 25px;
    height: 60px;
    width: 150px;
    margin-right:45px;

    ${(props) => props.cancel == true &&`
     background-color: ${branco}; 
     border:2px ${verde};
     `}

`;

export const CardPhoto = styled.Image`
    padding: 20px;
    width: 150px;
    height: 100px;
    border-radius: 20px;
    flex-direction:column;
    align-items: center;
    margin-right: 25px;
`;


export const DisplayCard = styled.TouchableOpacity`
    padding: 20px;
    padding-left:15px;
    margin-left:10px;
    margin-bottom:15px;
    width: 95%;
    height: 130px;
    background-color:${branco};
    border-radius: 20px;
    flex-direction: row;
    align-items: center;

    ${(props) => props.cat == true &&`
    margin-top:15px;
    margin-bottom:0px;
    `}
    ${(props) => props.add == true &&`
    margin-top:15px;
    margin-bottom:5px;
    height: 100px;
    background-color:${verde}
    `}
    ${(props) => props.addPerfil == true &&`
    margin-top:15px;
    margin-bottom:5px;
    height: 100px;
    background-color:${verde};
    margin-right:10px;
    `}
    ${(props) => props.perfil == true &&`
    margin-top:15px;
    margin-bottom:5px;
    height: 100px;
    background-color:${branco};
    margin-right:10px;
    `}
`;

export const StyleCardText = styled.View`
    flex-direction:column; 
    align-items:center;
    width: 70%;
`;

export const CardDisplayText = styled.Text`
    font-size: 22px;
    color:${letras};
    padding-left:20px;

    ${(props) => props.category == true &&`
        font-size: 15px;
        color:${texto};
     `}
        
`;

export const Filter = styled.TouchableOpacity`
    width: 40px;
    height: 40px;
    border-radius: 50px;
    padding:5px;
    align-items: center;
    margin-left:15%;
    margin-top:15px;

    ${(props) => props.cat == true &&`
        margin-left:83%;
        position:absolute;
     `}

`;

export const PerfilPhoto = styled.Image`
    padding: 20px;
    width: 150px;
    height: 150px;
    border-radius: 75px;
    flex-direction:column;
    align-items: center;
    margin-right: 13px;
    margin-top: 60px;

    ${(props) => props.perfil == true &&`
        padding-top: 25px;
        width: 80px;
        height: 80px;
        border-radius: 75px;
        align-items: center;
        margin-right: 13px;
        margin-top: 0px;
     `}

`;

export const StyledPerfilPhoto = styled.View`
    background-color:${fundo};
    padding-top: 25px;
    width: 80px;
    height: 80px;
    border-radius: 75px;
    align-items: center;
    margin-right: 13px;
    border:1px;
    border-color:${letras};
`;