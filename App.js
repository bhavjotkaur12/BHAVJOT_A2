import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';

export default function App() {
  // State for form inputs
  const [sendingAddress, setSendingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [parcelType, setParcelType] = useState(null);
  const [parcelWeight, setParcelWeight] = useState("");
  const [selectedRate, setSelectedRate] = useState(null);
  const [signatureOption, setSignatureOption] = useState(false);

  const PACKAGE_RATES = {
    standard: 12.99,
    xpress: 18.99,
    priority: 24.99
  };

  const LETTER_RATES = {
    standard: 4.99,
    xpress: 9.99,
    priority: 14.99
  };

  const SIGNATURE_COST = 2.00;
  const TAX_RATE = 0.13;

  const validateForm = () => {
    if (!sendingAddress || !destinationAddress) {
      Alert.alert("Error", "Please enter both addresses");
      return false;
    }

    if (!parcelType) {
      Alert.alert("Error", "Please select a parcel type");
      return false;
    }

    if (!parcelWeight) {
      Alert.alert("Error", "Please enter parcel weight");
      return false;
    }

    const weight = parseFloat(parcelWeight);
    if (parcelType === "package" && weight > 44) {
      Alert.alert("Error", "Package weight cannot exceed 44 lbs");
      return false;
    }

    if (parcelType === "letter" && weight > 1.1) {
      Alert.alert("Error", "Letter weight cannot exceed 1.1 lbs");
      return false;
    }

    if (!selectedRate) {
      Alert.alert("Error", "Please select a rate");
      return false;
    }

    return true;
  };

  const calculateTotal = () => {
    const rates = parcelType === "package" ? PACKAGE_RATES : LETTER_RATES;
    const subtotal = rates[selectedRate] + (signatureOption ? SIGNATURE_COST : 0);
    const tax = subtotal * TAX_RATE;
    const total = subtotal + tax;

    return {
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const handleGetRate = () => {
    if (validateForm()) {
      const totals = calculateTotal();
      const summary = {
        sendingAddress,
        destinationAddress,
        parcelType,
        parcelWeight,
        selectedRate,
        signatureOption,
        ...totals
      };
      
      // Create a more readable formatted message
      const message = [
        `From: ${summary.sendingAddress}`,
        `To: ${summary.destinationAddress}`,
        `Type: ${summary.parcelType.charAt(0).toUpperCase() + summary.parcelType.slice(1)}`,
        `Weight: ${summary.parcelWeight} lbs`,
        `Rate: $${summary.selectedRate}`,
        summary.signatureOption ? `Signature Option: +$${SIGNATURE_COST}` : '',
        `\nSubtotal: $${summary.subtotal}`,
        `Tax (13%): $${summary.tax}`,
        `\nTotal: $${summary.total}`
      ].filter(line => line !== '').join('\n');

      Alert.alert(
        "SwiftShip Order Summary",
        message,
        [
          {
            text: "Close",
            style: "default"
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>SwiftShip</Text>
        <Text style={styles.subHeader}>Fast & Reliable Delivery</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          value={sendingAddress}
          placeholder="Enter Sending Address"
          onChangeText={setSendingAddress}
          multiline
          placeholderTextColor="#666"
        />

        <TextInput
          style={styles.input}
          value={destinationAddress}
          placeholder="Enter Destination Address"
          onChangeText={setDestinationAddress}
          multiline
          placeholderTextColor="#666"
        />

        <View style={styles.radioGroup}>
          <Text style={styles.label}>Parcel Type:</Text>
          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setParcelType("package")}
          >
            <View style={styles.radioCircle}>
              {parcelType === "package" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioText}>Package</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.radioButton}
            onPress={() => setParcelType("letter")}
          >
            <View style={styles.radioCircle}>
              {parcelType === "letter" && <View style={styles.radioDot} />}
            </View>
            <Text style={styles.radioText}>Letter or Document</Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.input}
          value={parcelWeight}
          placeholder="Enter Parcel Weight"
          onChangeText={setParcelWeight}
          keyboardType="numeric"
          placeholderTextColor="#666"
        />

        <View style={styles.radioGroup}>
          <Text style={styles.label}>Choose Rate:</Text>
          {parcelType && (
            <>
              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSelectedRate("standard")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "standard" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Standard (${parcelType === "package" ? PACKAGE_RATES.standard : LETTER_RATES.standard})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSelectedRate("xpress")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "xpress" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Xpress Post (${parcelType === "package" ? PACKAGE_RATES.xpress : LETTER_RATES.xpress})</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.radioButton}
                onPress={() => setSelectedRate("priority")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "priority" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>Priority Post (${parcelType === "package" ? PACKAGE_RATES.priority : LETTER_RATES.priority})</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setSignatureOption(!signatureOption)}
        >
          <View style={styles.checkboxBox}>
            {signatureOption && <View style={styles.checkboxCheck} />}
          </View>
          <Text style={styles.checkboxText}>Signature Option (+${SIGNATURE_COST})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleGetRate}>
          <Text style={styles.buttonText}>Calculate Shipping</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  headerContainer: {
    backgroundColor: '#2c3e50',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 16,
    color: '#bdc3c7',
    textAlign: 'center',
    marginTop: 5,
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dcdde1',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  radioGroup: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  radioCircle: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3498db',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioDot: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: '#3498db',
  },
  radioText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  checkboxBox: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderColor: '#3498db',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
  },
  checkboxCheck: {
    height: 14,
    width: 14,
    backgroundColor: '#3498db',
    borderRadius: 2,
  },
  checkboxText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    padding: 18,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
