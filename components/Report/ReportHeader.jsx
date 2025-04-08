import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

const StatusFilterButton = ({ label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.filterButton, active && styles.activeFilterButton]}
    onPress={onPress}
  >
    <Text style={[styles.filterButtonText, active && styles.activeFilterButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const IncidentTypeButton = ({ icon, label, active, onPress }) => (
  <TouchableOpacity
    style={[styles.categoryButton, active && styles.activeCategoryButton]}
    onPress={onPress}
  >
    <MaterialIcons
      name={icon}
      size={24}
      color={active ? 'white' : Colors.primary}
    />
    <Text style={[styles.categoryButtonText, active && styles.activeCategoryButtonText]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const ReportHeader = ({ filter, onFilterChange, categoryFilter, onCategoryFilterChange }) => {
  const [showCategories, setShowCategories] = useState(false);

  return (
    <View style={styles.header}>
      <View style={styles.headerTop}>
        <Text style={styles.headerTitle}>NearShield        </Text>
        <TouchableOpacity 
          style={styles.categoriesToggle}
          onPress={() => setShowCategories(!showCategories)}
        >
          <Text style={styles.categoriesToggleText}>
            {showCategories ? 'Hide Categories' : 'Show Categories'}
          </Text>
          <MaterialIcons 
            name={showCategories ? 'keyboard-arrow-up' : 'keyboard-arrow-down'} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Status Filters */}
      <View style={styles.filterContainer}>
        <StatusFilterButton
          label="All"
          active={filter === 'all'}
          onPress={() => onFilterChange('all')}
        />
        <StatusFilterButton
          label="Solved"
          active={filter === 'solved'}
          onPress={() => onFilterChange('solved')}
        />
        <StatusFilterButton
          label="Unsolved"
          active={filter === 'unsolved'}
          onPress={() => onFilterChange('unsolved')}
        />
      </View>

      {/* Category Filters - Collapsible */}
      {showCategories && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          <IncidentTypeButton
            icon="public"
            label="All"
            active={categoryFilter === 'public'}
            onPress={() => onCategoryFilterChange('public')}
          />
          <IncidentTypeButton
            icon="directions-car"
            label="Road"
            active={categoryFilter === 'directions-car'}
            onPress={() => onCategoryFilterChange('directions-car')}
          />
          <IncidentTypeButton
            icon="local-fire-department"
            label="Fire"
            active={categoryFilter === 'local-fire-department'}
            onPress={() => onCategoryFilterChange('local-fire-department')}
          />
          <IncidentTypeButton
            icon="medical-services"
            label="Medical"
            active={categoryFilter === 'medical-services'}
            onPress={() => onCategoryFilterChange('medical-services')}
          />
          <IncidentTypeButton
            icon="local-gas-station"
            label="Gas Leak"
            active={categoryFilter === 'local-gas-station'}
            onPress={() => onCategoryFilterChange('local-gas-station')}
          />
          <IncidentTypeButton
            icon="local-bar"
            label="Drunk"
            active={categoryFilter === 'local-bar'}
            onPress={() => onCategoryFilterChange('local-bar')}
          />
          <IncidentTypeButton
            icon="flash-on"
            label="Electric"
            active={categoryFilter === 'flash-on'}
            onPress={() => onCategoryFilterChange('flash-on')}
          />
          <IncidentTypeButton
            icon="warning"
            label="Hazard"
            active={categoryFilter === 'warning'}
            onPress={() => onCategoryFilterChange('warning')}
          />
          <IncidentTypeButton
            icon="waves"
            label="Flood"
            active={categoryFilter === 'waves'}
            onPress={() => onCategoryFilterChange('waves')}
          />
          <IncidentTypeButton
            icon="construction"
            label="Road Work"
            active={categoryFilter === 'construction'}
            onPress={() => onCategoryFilterChange('construction')}
          />
          <IncidentTypeButton
            icon="local-police"
            label="Crime"
            active={categoryFilter === 'local-police'}
            onPress={() => onCategoryFilterChange('local-police')}
          />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  categoriesToggle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoriesToggleText: {
    color: 'white',
    marginRight: 4,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: 'white',
  },
  filterButtonText: {
    color: 'white',
    fontWeight: '500',
  },
  activeFilterButtonText: {
    color: Colors.primary,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
  },
  activeCategoryButton: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: 'white',
  },
  categoryButtonText: {
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: '500',
  },
  activeCategoryButtonText: {
    color: 'white',
  },
});

export default ReportHeader;