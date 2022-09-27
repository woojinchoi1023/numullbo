import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import * as Application from "expo-application";
import axios from "axios";
import { SafeAreaView } from "react-native-safe-area-context";
import { firebase_db } from "../firebaseConfig";

export default function SearchPage() {
  const userId = Application.androidId;
  const [valv, setValue] = useState([]);
  const [myFav, setMyFav] = useState([]);
  const [ready, setReady] = useState(false);

  let riotApiKey = "RGAPI-84377366-3592-4394-8ca7-180286a8bb65";

  const [apiData, setApiData] = useState([]);
  const [matchData, setMatchData] = useState([]);

  let sohwan =
    "https://kr.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
    valv +
    "?api_key=" +
    riotApiKey;
  let matchID =
    "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/" +
    apiData.puuid +
    "/ids" +
    "?api_key=" +
    riotApiKey +
    "&start=0&count=3";

  const getData = async () => {
    await axios.get(sohwan).then((response) => {
      setApiData(response.data);
    });

    await axios.get(matchID).then((response) => {
      // console.log(response)
      setMatchData(response.data);
    });
  };
  const addFav = () => {
    firebase_db.ref("users/" + userId + "/" + valv).set(apiData.puuid);
  };

  const getFav = () => {
    firebase_db
      .ref("users/" + userId)
      .once("value")
      .then((snapshot) => {
        let fav = snapshot.val();
        let fav_list = Object.keys(fav);
        if (fav_list && fav_list.length > 0) {
          setMyFav(fav_list);
          setReady(true);
        } else {
          console.log("불러오기실패");
        }
      });
  };

  useEffect(() => {}, []);

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        <Text style={styles.desc}> 닉네임을 적어주세요 </Text>
        <TextInput style={styles.input} onChangeText={(text) => setValue(text)}>
          {" "}
        </TextInput>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            getData();
          }}
        >
          <Text>검색!</Text>
        </TouchableOpacity>
        <Text style={styles.result}> {valv} 님의 정보입니다 : </Text>
        <Text> {apiData.puuid}</Text>
        <Text style={{ fontSize: 30, color: "red", fontWeight: "bold" }}>
          {" "}
          레벨: {apiData.summonerLevel}
        </Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            addFav();
          }}
        >
          <Text>찜 추가</Text>
        </TouchableOpacity>
        <Text style={{ marginTop: 20 }}>{matchData}</Text>
        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            getFav();
          }}
        >
          <Text>찜 불러오기</Text>
        </TouchableOpacity>
        {ready ? (
          myFav.map((content, i) => {
            return (
              <Text>
                {i}번째 찜 : {content}
              </Text>
            );
          })
        ) : (
          <Text>찜 목록이 비었습니다</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "pink",
    margin: 20,
    borderRadius: 30,
    padding: 10,
  },

  input: {
    height: 40,
    margin: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "white",
  },
  desc: {
    fontSize: 20,
    textAlign: "center",
  },
  searchButton: {
    backgroundColor: "white",
    borderWidth: 1,
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  result: {
    fontSize: 20,
    marginTop: 20,
    color: "blue",
    fontWeight: "bold",
  },
});
