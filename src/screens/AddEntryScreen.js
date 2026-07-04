import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import Screen from '../components/Screen';
import Button from '../components/Button';
import MoodPicker from '../components/MoodPicker';
import * as storage from '../storage/storage';
import { savePhoto, deletePhoto, photoUri } from '../storage/photos';

// Quick-pick durations in minutes.
const DURATIONS = [15, 30, 45, 60, 90, 120];

export default function AddEntryScreen({ route, navigation }) {
  // When `entry` is passed the screen edits that entry instead of adding one.
  const { spot, entry } = route.params;
  const isEditing = !!entry;
  const [mood, setMood] = useState(entry?.mood ?? 3);
  const [duration, setDuration] = useState(entry?.duration ?? 30);
  const [note, setNote] = useState(entry?.note ?? '');
  // Each photo is { name?, uri }: `name` is set for photos already stored on
  // the device; new picks only have a temporary `uri` until saved.
  const [photos, setPhotos] = useState(() =>
    (entry?.photos ?? []).map((name) => ({ name, uri: photoUri(name) }))
  );
  const [saving, setSaving] = useState(false);

  const addPhoto = async (fromCamera) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        fromCamera
          ? 'Allow camera access to take a photo for this entry.'
          : 'Allow photo library access to attach a photo to this entry.'
      );
      return;
    }
    const options = { mediaTypes: ['images'], quality: 0.7 };
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync({
          ...options,
          allowsMultipleSelection: true,
        });
    if (!result.canceled) {
      setPhotos((prev) => [
        ...prev,
        ...result.assets.map((asset) => ({ uri: asset.uri })),
      ]);
    }
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    // Copy newly picked photos into permanent app storage; already stored
    // ones keep their file name.
    const photoNames = photos.map((p) => p.name ?? savePhoto(p.uri));
    // When editing, remove stored photos the user deleted from the entry.
    (entry?.photos ?? [])
      .filter((name) => !photos.some((p) => p.name === name))
      .forEach(deletePhoto);
    const data = { mood, duration, note: note.trim(), photos: photoNames };
    if (isEditing) {
      await storage.updateEntry(spot.id, entry.id, data);
    } else {
      await storage.addEntry(spot.id, data);
    }
    navigation.goBack();
  };

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 12 }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {isEditing ? 'Editing entry at' : 'New entry at'}
          </Text>
          <Text className="mb-5 text-xl font-extrabold text-slate-900 dark:text-white">
            {spot.title}
          </Text>

          {/* Mood */}
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            How did this session feel?
          </Text>
          <View className="mb-6 rounded-2xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
            <MoodPicker value={mood} onChange={setMood} />
          </View>

          {/* Duration */}
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            How long did you study? ({duration} min)
          </Text>
          <View className="mb-6 flex-row flex-wrap">
            {DURATIONS.map((d) => {
              const selected = d === duration;
              return (
                <Pressable
                  key={d}
                  onPress={() => setDuration(d)}
                  className={`mb-2 mr-2 rounded-full border px-4 py-2 active:opacity-70 ${
                    selected
                      ? 'border-brand bg-brand'
                      : 'border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800'
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      selected
                        ? 'text-white'
                        : 'text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {d} min
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Note */}
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Notes
          </Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="What did you work on? How are you feeling about your progress?"
            placeholderTextColor="#94a3b8"
            multiline
            textAlignVertical="top"
            className="mb-6 min-h-[120px] rounded-2xl border border-slate-200 bg-white p-4 text-base text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
          />

          {/* Photos */}
          <Text className="mb-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
            Photos
          </Text>
          <View className="mb-2 flex-row flex-wrap">
            {photos.map((photo, index) => (
              <View key={photo.uri} className="mb-2 mr-2">
                <Image
                  source={{ uri: photo.uri }}
                  className="h-24 w-24 rounded-xl"
                />
                <Pressable
                  onPress={() => removePhoto(index)}
                  hitSlop={8}
                  className="absolute -right-1.5 -top-1.5 h-6 w-6 items-center justify-center rounded-full bg-slate-900/80"
                >
                  <Ionicons name="close" size={14} color="#ffffff" />
                </Pressable>
              </View>
            ))}
          </View>
          <View className="mb-6 flex-row">
            <View className="mr-2 flex-1">
              <Button
                label="Camera"
                icon="camera-outline"
                variant="secondary"
                onPress={() => addPhoto(true)}
              />
            </View>
            <View className="flex-1">
              <Button
                label="Library"
                icon="images-outline"
                variant="secondary"
                onPress={() => addPhoto(false)}
              />
            </View>
          </View>

          <Button
            label={saving ? 'Saving…' : isEditing ? 'Save changes' : 'Save entry'}
            icon="checkmark"
            onPress={handleSave}
            disabled={saving}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
