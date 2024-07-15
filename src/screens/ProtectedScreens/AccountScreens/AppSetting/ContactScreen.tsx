import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState, } from 'react';
import * as Contacts from 'expo-contacts';
import { AntDesign } from '@expo/vector-icons';
import Responsiveness from '../../../../helpers/Responsiveness';
import Btn from '../../../../widget/Btn';

const ContactScreen = () => {
    const [myContact, setMyContact] = useState<any>([]);
    const [filteredContacts, setFilteredContacts] = useState<any>([])
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedContacts, setSelectedContacts] = useState<string[]>([])

    const handleContactPress = (contactName: string) => {
      if (selectedContacts.includes(contactName)) {
        // Remove contact from selectedContacts
        setSelectedContacts(selectedContacts.filter((name) => name !== contactName));
      } else {
        // Add contact to selectedContacts
        setSelectedContacts([...selectedContacts, contactName]);
      }
    };

    const renderItem = ({ item }: any) => (
      <TouchableOpacity onPress={()=> handleContactPress(item.name)} style={styles.contactItem}>
        <View>
          <Text style={styles.contactName}>{item.name}</Text>
          {item.phoneNumbers && (
            <Text style={styles.contactPhone}>
              {item.phoneNumbers.map((number: any) => number.number).join(', ')}
            </Text>
          )}
        </View>
        {selectedContacts.includes(item.name) && (
        <AntDesign name="check" size={24} color="blue" />
      )}
      </TouchableOpacity>
    );

    useEffect(() => {
      const filtered = myContact.filter((contact: any) =>
        contact?.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredContacts(filtered); // Update filteredContacts when searchQuery changes
    }, [searchQuery, myContact]);

    useEffect(() => {
        (async () => {
          const { status } = await Contacts.requestPermissionsAsync();
          if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
              fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
            });
    
            if (data.length > 0) {
              const contact = data[0];
              // setMyContact(contact)
              setMyContact(data);
              setFilteredContacts(data)
              console.log("Mycontact: ...", contact);
            }
          }
        })();
      }, []);
  return (
    <View style={styles.container}>
    <View className='items-center my-4'>
      <TextInput
        style={styles.searchInput}
        placeholder="Search contacts..."
        onChangeText={(text) => setSearchQuery(text)}
      />
    </View>
    <FlatList
      data={filteredContacts}
      keyExtractor={(item: any) => item?.id}
      renderItem={renderItem}
    />
    {selectedContacts.length > 0 && <View className='items-center bg-white mb-2'>
      <Btn type='action' label={"Save changes"}/>
    </View>}
  </View>
  )
}

export default ContactScreen
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    width: Responsiveness.getResponsiveWidth(90),
    backgroundColor: 'white'
  },
  contactItem: {
    paddingHorizontal: 20,
    paddingVertical: Responsiveness.getResponsiveHeight(2),
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor:'white'
  },
  contactName: {
    fontWeight: 'bold',
  },
  contactPhone: {
    color: '#888',
  },
});
