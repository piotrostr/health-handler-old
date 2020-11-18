import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image,
  StyleSheet, Animated, TouchableOpacity} from 'react-native';
import {Icon} from 'react-native-elements';
import {GreenDivider, GrayDivider, ThinGrayDivider} from '../components/Dividers.js';
import {ReturnButton} from '../components/Buttons.js';
import {DropdownIcon} from "./InputScreen";
import axios from 'axios';

const user = {
  "username":"api-52495-ec283c8e-e354-41d1-ae07-0ca4d098c8dd",
  "hash":"a0e87d57d77da830a56dce0af315e1eec9b7309e"
};
const SCREEN_WIDTH = 375;
const SCREEN_HEIGHT = 812;
const GREEN = '#6FBF44';

const ShoppingListButton = ({recipes, onPress}) => {
  return (recipes.length === 7*3 ?
      <Icon type="font-awesome" name="shopping-cart"
            onPress={onPress} color={GREEN} />
      : <Icon type="font-awesome" name="shopping-cart"
              onPress={onPress} color={GREEN} />
  );
}

const Meal = ({id, imageType, title, mealType}) => {
  const size = '240x150';
  const uri = `https://spoonacular.com/recipeImages/${id}-${size}.${imageType}`;
  return ( id && title ?
    <View style={{height: 60, flex: 1, flexDirection: 'column'}}>
      <View style={{display: 'flex', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center', paddingBottom: 6}}>
        <Image style={{width: 50, height: 50, borderRadius: 50, marginRight: 8}}
               source={{uri: uri}} />
        <View>
          <Text style={[styles.text, {fontSize: 11, color: GREEN}]}>{mealType}</Text>
          <Text style={{width: 250, height: 40, fontSize: 16}}>{title}</Text>
        </View>
        <View style={{height: 40, display: 'flex', justifyContent: 'space-between'}}>
          <Icon onPress={() => {}} type="font-awesome" name="question"
                color={GREEN} size={15}/>
          <Icon onPress={() => {}} type="font-awesome" name="exchange"
                color={GREEN} size={15}/>
        </View>
      </View>
      <ThinGrayDivider />
    </View> : null
);
}

const MealsDay = ({dayName, meals}) => {
  const value = useRef(new Animated.Value(0))
  const mealTypes = ['BREAKFAST', 'LUNCH', 'DINNER'];
  return (
    <View>
      <TouchableOpacity style={{display: 'flex', flexDirection: 'row',
        justifyContent: 'space-between', alignItems: 'center'}} onPress={() => {}}>
        <Text style={[styles.text, {fontSize: 16, textTransform: 'capitalize',
          marginVertical: 10}]}>
          {dayName}
        </Text>
        <DropdownIcon />
      </TouchableOpacity>
      <GreenDivider/>
      <View style={{marginVertical: 15}}>
        {meals.map(({id, imageType, title, readyInMinutes, servings}, index) =>
          <Meal imageType={imageType} title={title} readyInMinutes={readyInMinutes}
                servings={servings} key={id} id={id} mealType={mealTypes[index]}/>
        )}
        <Meal />
      </View>
    </View>
  );
}

const MealPlanScreen = ({navigation}) => {
  const base = 'https://api.spoonacular.com/mealplanner/generate';
  const apiKey = '?apiKey=556d5c003785468ab5aa696a128a3d3a';
  //const apiKey = '?apiKey=5bb1646af40448c4bd763b79205bc198'
  const [data, setData] = useState([]);
  const recipes = [];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(base + apiKey);
        console.log('result:', res);
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    !data.length ? fetchData() : null;
  }, []);


  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <ReturnButton onPress={() => navigation.navigate('InputScreen')} />
        <Text style={[styles.text, {fontSize: 30}]}>Meal Plan</Text>
        <ShoppingListButton onPress={() => navigation.navigate('ShoppingListScreen')}
                            recipes={recipes}/>
      </View>
      <GrayDivider />
      <View style={{marginTop: 20}}>
        {data.week ?
          Object.values(data.week).map(({meals, nutrients}, index) => {
            meals.forEach((meal) => recipes.push(meal.id))
            return (
              <MealsDay dayName={Object.keys(data.week)[index]}  meals={meals}
                        nutrients={nutrients} key={index}/>
            );
          }) : <Text style={styles.text}>loading...</Text>
        }
      </View>
    </View>
  );
}
// TODO add activity indicator above
const styles = StyleSheet.create({
  screen: {display: 'flex', flexDirection: 'column', width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT, paddingVertical: 10, paddingHorizontal: 27,
    backgroundColor: 'white'},
  header: {
    height: 45, display: 'flex', flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: 'center', margin: 10
  },
  text: {fontStyle: 'KumbhSans-Regular'}
});

export default MealPlanScreen;
