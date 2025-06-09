import { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';

export default function App() {
  const [sendingAddress, setSendingAddress] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");
  const [parcelType, setParcelType] = useState(null);
  const [parcelWeight, setParcelWeight] = useState("");
  const [selectedRate, setSelectedRate] = useState(null);
  const [signatureOption, setSignatureOption] = useState(false);


  const [modalVisible, setModalVisible] = useState(false);
  const [modalSummary, setModalSummary] = useState({});

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
      setModalSummary({ error: "Please enter both addresses" });
      setModalVisible(true);
      return false;
    }
    if (!parcelType) {
      setModalSummary({ error: "Please select a parcel type" });
      setModalVisible(true);
      return false;
    }
    if (!parcelWeight) {
      setModalSummary({ error: "Please enter parcel weight" });
      setModalVisible(true);
      return false;
    }
    const weight = parseFloat(parcelWeight);
    if (parcelType === "package" && weight > 44) {
      setModalSummary({ error: "Package weight cannot exceed 44 lbs" });
      setModalVisible(true);
      return false;
    }
    if (parcelType === "letter" && weight > 1.1) {
      setModalSummary({ error: "Letter weight cannot exceed 1.1 lbs" });
      setModalVisible(true);
      return false;
    }
    if (!selectedRate) {
      setModalSummary({ error: "Please select a rate" });
      setModalVisible(true);
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
      setModalSummary({
        sendingAddress,
        destinationAddress,
        parcelType,
        parcelWeight,
        selectedRate,
        signatureOption,
        ...totals
      });
      setModalVisible(true);
    }
  };

  const getRateDisplay = () => {
    if (!modalSummary.selectedRate || !modalSummary.parcelType) {
      return "";
    }

    const rates = modalSummary.parcelType === "package" ? PACKAGE_RATES : LETTER_RATES;
    const rateAmount = rates[modalSummary.selectedRate];
    const rateType = modalSummary.selectedRate[0].toUpperCase() + modalSummary.selectedRate.slice(1);

    return `${rateAmount} (${rateType})`;
  };

  return (
    <View style={styles.bg}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.header}>SwiftShip</Text>
          <Text style={styles.subHeader}>Fast & Reliable Delivery</Text>

          <TextInput
            style={styles.input}
            value={sendingAddress}
            placeholder="Enter Sending Address"
            onChangeText={setSendingAddress}
            placeholderTextColor="#666"
          />

          <TextInput
            style={styles.input}
            value={destinationAddress}
            placeholder="Enter Destination Address"
            onChangeText={setDestinationAddress}
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Parcel Type:</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                parcelType === "package" && styles.radioButtonSelected,
              ]}
              onPress={() => setParcelType("package")}
            >
              <View style={styles.radioCircle}>
                {parcelType === "package" && <View style={styles.radioDot} />}
              </View>
              <Text style={styles.radioText}>Package</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                parcelType === "letter" && styles.radioButtonSelected,
              ]}
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
            placeholder="Enter Parcel Weight in Lbs"
            onChangeText={setParcelWeight}
            keyboardType="numeric"
            placeholderTextColor="#666"
          />

          <Text style={styles.label}>Choose Rate:</Text>
          {parcelType && (
            <View style={styles.radioGroup}>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedRate === "standard" && styles.radioButtonSelected,
                ]}
                onPress={() => setSelectedRate("standard")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "standard" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>
                  Standard (${parcelType === "package" ? PACKAGE_RATES.standard : LETTER_RATES.standard})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedRate === "xpress" && styles.radioButtonSelected,
                ]}
                onPress={() => setSelectedRate("xpress")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "xpress" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>
                  Xpress Post (${parcelType === "package" ? PACKAGE_RATES.xpress : LETTER_RATES.xpress})
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.radioButton,
                  selectedRate === "priority" && styles.radioButtonSelected,
                ]}
                onPress={() => setSelectedRate("priority")}
              >
                <View style={styles.radioCircle}>
                  {selectedRate === "priority" && <View style={styles.radioDot} />}
                </View>
                <Text style={styles.radioText}>
                  Priority Post (${parcelType === "package" ? PACKAGE_RATES.priority : LETTER_RATES.priority})
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.checkbox,
              signatureOption && styles.checkboxSelected,
            ]}
            onPress={() => setSignatureOption(!signatureOption)}
          >
            <View style={styles.checkboxBox}>
              {signatureOption && <View style={styles.checkboxCheck} />}
            </View>
            <Text style={styles.checkboxText}>Signature Option (+${SIGNATURE_COST})</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGetRate}>
            <Text style={styles.buttonText}>Get Rate</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal
        visible={modalVisible}
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {modalSummary.error ? (
              <Text style={styles.errorText}>{modalSummary.error}</Text>
            ) : (
              <>
                <Text style={styles.modalHeader}>Order Summary</Text>
                <View style={styles.divider} />
                <Text style={styles.modalText}>From: {modalSummary.sendingAddress}</Text>
                <Text style={styles.modalText}>To: {modalSummary.destinationAddress}</Text>
                <Text style={styles.modalText}>Type: {modalSummary.parcelType}</Text>
                <Text style={styles.modalText}>Weight: {modalSummary.parcelWeight} lbs</Text>
                <Text style={styles.modalText}>Rate: ${getRateDisplay()}</Text>
                {modalSummary.signatureOption && (
                  <Text style={styles.modalText}>Signature Option: +${SIGNATURE_COST}</Text>
                )}
                <Text style={styles.modalText}>Subtotal: ${modalSummary.subtotal}</Text>
                <Text style={styles.modalText}>Tax (13%): ${modalSummary.tax}</Text>
                <Text style={styles.modalText}>Total: ${modalSummary.total}</Text>
              </>
            )}
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#eaf6fb',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 8,
    marginVertical: 32,
  },
  header: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#1a5276',
    textAlign: 'center',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 18,
    color: '#2980b9',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f8fafd',
    borderWidth: 1.5,
    borderColor: '#aed6f1',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    fontSize: 17,
    color: '#1a5276',
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a5276',
    marginBottom: 10,
    marginTop: 8,
  },
  radioGroup: {
    backgroundColor: '#f8fafd',
    borderRadius: 12,
    marginBottom: 18,
    padding: 10,
    borderWidth: 1,
    borderColor: '#d6eaf8',
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  radioButtonSelected: {
    backgroundColor: '#eaf2fb',
  },
  radioCircle: {
    height: 26,
    width: 26,
    borderRadius: 13,
    borderWidth: 2.5,
    borderColor: '#2980b9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    backgroundColor: '#fff',
  },
  radioDot: {
    height: 13,
    width: 13,
    borderRadius: 7,
    backgroundColor: '#2980b9',
  },
  radioText: {
    fontSize: 17,
    color: '#1a5276',
    fontWeight: '500',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafd',
    padding: 14,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#d6eaf8',
  },
  checkboxSelected: {
    backgroundColor: '#eaf2fb',
    borderColor: '#2980b9',
  },
  checkboxBox: {
    height: 26,
    width: 26,
    borderWidth: 2.5,
    borderColor: '#2980b9',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  checkboxCheck: {
    height: 15,
    width: 15,
    backgroundColor: '#2980b9',
    borderRadius: 3,
  },
  checkboxText: {
    fontSize: 17,
    color: '#1a5276',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#2980b9',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2980b9',
    shadowOpacity: 0.18,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 28,
    width: '85%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1a5276',
    marginBottom: 8,
    textAlign: 'center',
  },
  divider: {
    width: '100%',
    height: 1.5,
    backgroundColor: '#d6eaf8',
    marginVertical: 10,
    borderRadius: 1,
  },
  modalText: {
    fontSize: 18,
    color: '#1a5276',
    marginBottom: 6,
    textAlign: 'center',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 20,
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 12,
    paddingHorizontal: 36,
    borderRadius: 10,
    marginTop: 18,
    alignItems: 'center',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});
