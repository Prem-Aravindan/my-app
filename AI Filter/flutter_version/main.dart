import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await Supabase.initialize(
    url: 'your_supabase_project_url',
    anonKey: 'your_supabase_anon_key',
  );

  runApp(const AIFilterApp());
}

class AIFilterApp extends StatelessWidget {
  const AIFilterApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'AI Filter',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _selectedIndex = 0;

  static const List<Widget> _pages = <Widget>[
    HomeTab(),
    UploadTab(),
    ProfileTab(),
  ];

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: _pages[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.upload),
            label: 'Upload',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'Profile',
          ),
        ],
        currentIndex: _selectedIndex,
        onTap: _onItemTapped,
      ),
    );
  }
}

class HomeTab extends StatelessWidget {
  const HomeTab({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      appBar: AppBar(
        title: Text('AI Filter'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.psychology,
              size: 64,
              color: Colors.blue,
            ),
            SizedBox(height: 16),
            Text(
              'Welcome to AI Filter',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
              ),
            ),
            SizedBox(height: 8),
            Text(
              'Detect AI-generated content with confidence',
              style: TextStyle(
                fontSize: 16,
                color: Colors.grey,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class UploadTab extends StatelessWidget {
  const UploadTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBar(
        title: Text('Upload Content'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement image picker
              },
              icon: const Icon(Icons.photo_library),
              label: const Text('Choose from Photos'),
            ),
            const SizedBox(height: 16),
            ElevatedButton.icon(
              onPressed: () {
                // TODO: Implement file picker
              },
              icon: const Icon(Icons.folder),
              label: const Text('Browse Files'),
            ),
          ],
        ),
      ),
    );
  }
}

class ProfileTab extends StatelessWidget {
  const ProfileTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: const AppBar(
        title: Text('Profile'),
      ),
      body: const Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            CircleAvatar(
              radius: 40,
              child: Icon(Icons.person, size: 40),
            ),
            SizedBox(height: 16),
            Text(
              'Sign in to get started',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
