import React from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    Dimensions 
} from "react-native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

import { Colors } from "../../constants/Colors";
import { sectionTitle } from "../../constants/section";

const { width } = Dimensions.get('window');

const DataAnalytics = () => {
    const analyticsData = {
        totalIncidents: 24,
        solvedIncidents: 18
    };

    const AnalyticsCard = ({ 
        icon, 
        iconName, 
        value, 
        label, 
        color 
    }) => (
        <View style={styles.analyticsCard}>
            <View style={styles.iconContainer}>
                {React.createElement(icon, {
                    name: iconName,
                    size: 24,
                    color: color
                })}
            </View>
            <Text style={styles.analyticsValue}>{value}</Text>
            <Text style={styles.analyticsLabel}>{label}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={sectionTitle}>Incident Analytics</Text>
            
            <View style={styles.analyticsGrid}>
                <AnalyticsCard 
                    icon={MaterialIcons}
                    iconName="crisis-alert"
                    value={analyticsData.totalIncidents}
                    label="Total Incidents"
                    color={Colors.warning}
                />
                
                <AnalyticsCard 
                    icon={MaterialCommunityIcons}
                    iconName="check-circle"
                    value={analyticsData.solvedIncidents}
                    label="Solved Incidents"
                    color={Colors.success}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        // borderRadius: 12,
        padding: 16,
        // marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        // elevation: 3,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 16,
        paddingHorizontal: 8,
    },
    analyticsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    analyticsCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 16,
        width: '48%', // Adjusted to fit two cards side by side
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        backgroundColor: '#F0F4F8',
        borderRadius: 20,
        padding: 8,
        marginBottom: 10,
    },
    analyticsValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#2C3E50',
        marginBottom: 4,
    },
    analyticsLabel: {
        fontSize: 12,
        color: '#7F8C8D',
        textAlign: 'center',
    },
});

export default DataAnalytics;