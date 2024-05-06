import React from 'react';

//React navigation
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from 'react-native-vector-icons/Ionicons';

//colors
import {Colors} from './../components/styles';

import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();

//screens
import Login from './../screens/Login';
import Registo from './../screens/Registo';
import Principal from './../screens/Principal';
import Lista from './../screens/Lista';
import Stats from './../screens/Stats';
import Details from './../screens/Details';
import Cartoes from './../screens/Cartoes';
import Cartao from './../screens/Cartao';
import BarcodeScanner from '../screens/BarcodeScanner';
import CardSelect from './../screens/CardSelect';
import Categorias from '../screens/Categorias';
import Outras from '../screens/Outras';
import OutrasCat from '../screens/OutrasCat';
import PerfilPage from '../screens/PerfilPage';
import CreatePerfil from '../screens/CreatePerfil';
import CartaoId from '../screens/CartaoId';
import CardSelectId from './../screens/CardSelectId';

const Tab = createBottomTabNavigator();
const homeName = 'Página Principal';
const stats = 'Estatisticas';
const addCart = 'Adicionar Cartão';
const carts = 'Cartões';
const details = 'Definições';



const RootStack = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={() => ({
                    headerStyle: {
                        backgroundColor: 'transparent'
                    },
                    headerTransparent: true,
                    headerTitle:'',
                    headedrLeftContainerStyle: {
                        paddingLeft: 20
                    }                                     
                })}                
            >
                <Stack.Screen name={'Login'} component={Login}/>
                <Stack.Screen name={'Registo'} component={Registo}/>
                <Stack.Screen name={'Cartao'} component={Cartao}/>
                <Stack.Screen name={'BarcodeScanner'} component={BarcodeScanner}/>
                <Stack.Screen name={'CardSelect'} component={CardSelect}/>
                <Stack.Screen name={'Categorias'} component={Categorias}/>
                <Stack.Screen name={'Outras'} component={Outras}/>
                <Stack.Screen name={'OutrasCat'} component={OutrasCat}/>
                <Stack.Screen name={'PerfilPage'} component={PerfilPage}/>
                <Stack.Screen name={'CreatePerfil'} component={CreatePerfil}/>
                <Stack.Screen name={'CartaoId'} component={CartaoId}/>
                <Stack.Screen name={'CardSelectId'} component={CardSelectId}/>
                <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }}
            />            
                
            </Stack.Navigator>
            
        </NavigationContainer>
    );
};

const MainTabs = () => {
    return (
            <Tab.Navigator
            screenOptions={({route}) => ({
                headerStyle: {
                    backgroundColor: 'transparent'
                },
                headerTransparent: true,
                headerTitle:'',
                headedrLeftContainerStyle: {
                    paddingLeft: 20
                },
                
                tabBarActiveTintColor: Colors.verde,
                tabBarInativeTintColor: Colors.texto,
                tabBarLabelStyle: {paddingBottom: 10, fontSize: 10},
                tabBarStyle: {padding: 10, height: 60},

                tabBarIcon: ({focused, color}) => {
                    let iconName;
                    let rn = route.name;
                    if (rn === homeName) {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (rn === addCart) {
                        iconName = focused ? 'add-circle' : 'add-circle-outline';
                    } else if (rn === carts) {
                        iconName = focused ? 'wallet' : 'wallet-outline';
                    } else if (rn === details) {
                        iconName = focused ? 'cog' : 'cog-outline';
                    } else if (rn === stats) {
                        iconName = focused ? 'stats-chart' : 'stats-chart-outline';
                    }

                    return <Ionicons name={iconName} size={25} color={color} />;
                },
                
            })}>
                    <Tab.Screen name={homeName} component={Principal}/>
                    <Tab.Screen name={stats} component={Stats}/>
                    <Tab.Screen name={addCart} component={Lista}/>
                    <Tab.Screen name={carts} component={Cartoes}/>
                    <Tab.Screen name={details} component={Details}/>
            </Tab.Navigator>
        
    )
}
export default RootStack;
