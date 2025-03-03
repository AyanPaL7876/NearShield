import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { Colors } from '../constants/Colors';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// Mock data for demonstrations
const MOCK_DATA = {
  crimeStats: {
    today: 24,
    thisWeek: 157,
    thisMonth: 682,
    previousMonth: 703
  },
  responseTimeStats: {
    today: 8.5,
    thisWeek: 9.2,
    thisMonth: 8.7,
    previousMonth: 10.2
  },
  incidentsByType: [
    { type: 'Theft', count: 213, color: '#4ECDC4' },
    { type: 'Assault', count: 145, color: '#FF6B6B' },
    { type: 'Accident', count: 178, color: '#FFB347' },
    { type: 'Fire', count: 42, color: '#845EC2' },
    { type: 'Medical', count: 104, color: '#D65DB1' }
  ],
  highRiskAreas: [
    { name: 'Downtown', riskLevel: 'High', incidents: 137 },
    { name: 'Westside', riskLevel: 'Medium', incidents: 84 },
    { name: 'North District', riskLevel: 'High', incidents: 112 }
  ]
};

const StatCard = ({ title, value, icon, color, percent, isUp }) => (
  <View style={styles.statCard}>
    <View style={styles.statHeader}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        {icon}
      </View>
      {percent && (
        <View style={styles.percentContainer}>
          {isUp ? 
            <Ionicons name="arrow-up" size={12} color="#FF6B6B" /> : 
            <Ionicons name="arrow-down" size={12} color="#4ECDC4" />
          }
          <Text style={[styles.percentText, { color: isUp ? '#FF6B6B' : '#4ECDC4' }]}>
            {percent}%
          </Text>
        </View>
      )}
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statTitle}>{title}</Text>
  </View>
);

const AnalyticsDashboardScreen = () => {
  const navigation = useNavigation();
  const [timeFilter, setTimeFilter] = useState('month'); // 'day', 'week', 'month'
  
  const getStatValue = (dataset, filter) => {
    switch(filter) {
      case 'day': return dataset.today;
      case 'week': return dataset.thisWeek;
      case 'month': return dataset.thisMonth;
      default: return dataset.thisMonth;
    }
  };
  
  // Calculate month-over-month percentage change
  const crimePercentChange = ((MOCK_DATA.crimeStats.thisMonth - MOCK_DATA.crimeStats.previousMonth) / MOCK_DATA.crimeStats.previousMonth * 100).toFixed(1);
  const responsePercentChange = ((MOCK_DATA.responseTimeStats.thisMonth - MOCK_DATA.responseTimeStats.previousMonth) / MOCK_DATA.responseTimeStats.previousMonth * 100).toFixed(1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics Dashboard</Text>
        <TouchableOpacity>
          <Ionicons name="options-outline" size={24} color={Colors.PRIMARY} />
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.content}>
        {/* Time Filter */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[styles.filterButton, timeFilter === 'day' && styles.activeFilter]}
            onPress={() => setTimeFilter('day')}
          >
            <Text style={[styles.filterText, timeFilter === 'day' && styles.activeFilterText]}>Day</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, timeFilter === 'week' && styles.activeFilter]}
            onPress={() => setTimeFilter('week')}
          >
            <Text style={[styles.filterText, timeFilter === 'week' && styles.activeFilterText]}>Week</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.filterButton, timeFilter === 'month' && styles.activeFilter]}
            onPress={() => setTimeFilter('month')}
          >
            <Text style={[styles.filterText, timeFilter === 'month' && styles.activeFilterText]}>Month</Text>
          </TouchableOpacity>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsGrid}>
          <StatCard
            title="Total Incidents"
            value={getStatValue(MOCK_DATA.crimeStats, timeFilter)}
            icon={<MaterialIcons name="crisis-alert" size={24} color="#FF6B6B" />}
            color="#FF6B6B"
            percent={Math.abs(crimePercentChange)}
            isUp={crimePercentChange > 0}
          />
          <StatCard
            title="Avg Response Time"
            value={`${getStatValue(MOCK_DATA.responseTimeStats, timeFilter)} min`}
            icon={<MaterialIcons name="timer" size={24} color="#4ECDC4" />}
            color="#4ECDC4"
            percent={Math.abs(responsePercentChange)}
            isUp={responsePercentChange > 0}
          />
        </View>
        
        {/* Heat Map Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Crime Heatmap</Text>
          <View style={styles.heatmapContainer}>
            {/* This would be a real map in a production app */}
            <View style={styles.mockHeatmap}>
              <Text style={styles.mockMapText}>Interactive Crime Heatmap</Text>
              <Text style={styles.mockMapSubtext}>Showing high-risk areas based on incident density</Text>
            </View>
          </View>
        </View>
        
        {/* Incidents by Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Incidents by Type</Text>
          <View style={styles.chartContainer}>
            {MOCK_DATA.incidentsByType.map((item, index) => (
              <View key={index} style={styles.chartItem}>
                <View style={styles.chartLabelContainer}>
                  <View style={[styles.chartColorDot, {backgroundColor: item.color}]} />
                  <Text style={styles.chartLabel}>{item.type}</Text>
                </View>
                <Text style={styles.chartValue}>{item.count}</Text>
                <View style={styles.chartBarContainer}>
                  <View 
                    style={[
                      styles.chartBar, 
                      {
                        backgroundColor: item.color,
                        width: `${(item.count / 250) * 100}%` // Scale to max 250 for demo
                      }
                    ]} 
                  />
                </View>
              </View>
            ))}
          </View>
        </View>
        
        {/* High Risk Areas */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>High Alert Areas</Text>
          {MOCK_DATA.highRiskAreas.map((area, index) => (
            <View key={index} style={styles.areaCard}>
              <View style={styles.areaInfo}>
                <Text style={styles.areaName}>{area.name}</Text>
                <View style={[
                  styles.riskBadge, 
                  {backgroundColor: area.riskLevel === 'High' ? '#FFEBEE' : '#E0F7FA'}
                ]}>
                  <Text style={[
                    styles.riskText, 
                    {color: area.riskLevel === 'High' ? '#FF6B6B' : '#4ECDC4'}
                  ]}>
                    {area.riskLevel} Risk
                  </Text>
                </View>
              </View>
              <View style={styles.areaStats}>
                <Text style={styles.incidentCount}>{area.incidents}</Text>
                <Text style={styles.incidentLabel}>Incidents</Text>
              </View>
            </View>
          ))}
        </View>
        
        {/* Predictive Analytics Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Predictive Analytics</Text>
          <View style={styles.predictiveCard}>
            <MaterialIcons name="insights" size={24} color={Colors.PRIMARY} />
            <View style={styles.predictiveContent}>
              <Text style={styles.predictiveTitle}>Weekend Forecast</Text>
              <Text style={styles.predictiveDescription}>
                Based on historical data, expect a 22% increase in incidents in Downtown and Westside districts this weekend.
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.viewFullReportButton}>
            <Text style={styles.viewFullReportText}>View Full Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  activeFilter: {
    backgroundColor: Colors.PRIMARY,
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#666',
  },
  activeFilterText: {
    color: '#fff',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  percentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 12,
    fontFamily: 'outfit-medium',
    marginLeft: 2,
  },
  statValue: {
    fontSize: 22,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 14,
    fontFamily: 'outfit',
    color: '#666',
  },
  section: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    marginBottom: 15,
    color: '#333',
  },
  heatmapContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  mockHeatmap: {
    backgroundColor: '#e0e0e0',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mockMapText: {
    fontSize: 16,
    fontFamily: 'outfit-bold',
    color: '#555',
  },
  mockMapSubtext: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: '#777',
    marginTop: 5,
  },
  chartContainer: {
    marginTop: 10,
  },
  chartItem: {
    marginBottom: 12,
  },
  chartLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  chartColorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  chartLabel: {
    fontSize: 14,
    fontFamily: 'outfit-medium',
    color: '#333',
  },
  chartValue: {
    position: 'absolute',
    right: 0,
    top: 0,
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
  chartBarContainer: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    marginTop: 5,
    width: '100%',
  },
  chartBar: {
    height: '100%',
    borderRadius: 4,
  },
  areaCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  areaInfo: {
    flex: 1,
  },
  areaName: {
    fontSize: 15,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 5,
  },
  riskBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  riskText: {
    fontSize: 12,
    fontFamily: 'outfit-medium',
  },
  areaStats: {
    alignItems: 'center',
  },
  incidentCount: {
    fontSize: 18,
    fontFamily: 'outfit-bold',
    color: '#333',
  },
  incidentLabel: {
    fontSize: 12,
    fontFamily: 'outfit',
    color: '#666',
  },
  predictiveCard: {
    backgroundColor: '#F3F8FF',
    padding: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  predictiveContent: {
    marginLeft: 15,
    flex: 1,
  },
  predictiveTitle: {
    fontSize: 15,
    fontFamily: 'outfit-bold',
    color: '#333',
    marginBottom: 5,
  },
  predictiveDescription: {
    fontSize: 13,
    fontFamily: 'outfit',
    color: '#666',
    lineHeight: 18,
  },
  viewFullReportButton: {
    alignSelf: 'flex-end',
    marginTop: 15,
    paddingVertical: 8,
    paddingHorizontal: 15,
    backgroundColor: Colors.PRIMARY,
    borderRadius: 8,
  },
  viewFullReportText: {
    fontSize: 14,
    fontFamily: 'outfit-bold',
    color: '#fff',
  },
});

export default AnalyticsDashboardScreen;