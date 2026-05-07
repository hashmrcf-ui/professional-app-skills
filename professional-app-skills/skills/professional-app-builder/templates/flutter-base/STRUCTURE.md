# Flutter Base Template

This is the recommended starting structure for a Flutter app built with this skill.

## Directory Layout

```
lib/
├── main.dart
├── app/
│   ├── app.dart                    # MaterialApp + i18n + theme wiring
│   ├── theme/
│   │   ├── app_theme.dart          # ThemeData (light + dark)
│   │   ├── colors.dart             # AppColors class with all hex values
│   │   ├── text_styles.dart        # AppText class (display, h1, h2, ...)
│   │   └── spacing.dart            # AppSpacing class (xs, sm, md, ...)
│   └── navigation/
│       ├── app_router.dart         # GoRouter configuration
│       └── routes.dart             # Route name constants
├── features/
│   └── [feature_name]/
│       ├── screens/
│       │   └── [screen_name]_screen.dart
│       ├── widgets/
│       │   └── [widget_name].dart
│       └── controllers/
│           └── [controller_name].dart
├── shared/
│   ├── widgets/
│   │   ├── app_button.dart         # Press feedback built in
│   │   ├── app_card.dart
│   │   ├── app_input.dart
│   │   ├── animated_counter.dart   # From examples/animated-counter-flutter
│   │   ├── skeleton_loader.dart
│   │   └── svg_icon.dart
│   ├── utils/
│   │   ├── direction_helper.dart   # isRtl(context) helper
│   │   └── formatters.dart
│   └── constants/
│       └── app_constants.dart
└── l10n/
    ├── app_en.arb
    └── app_ar.arb
```

## Required Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter
  intl: ^0.19.0
  google_fonts: ^6.2.1
  go_router: ^14.0.0
  flutter_svg: ^2.0.10
  shimmer: ^3.0.0
  cached_network_image: ^3.3.1

flutter:
  generate: true
  uses-material-design: true
```

## main.dart Starter

```dart
import 'package:flutter/material.dart';
import 'app/app.dart';

void main() {
  runApp(const App());
}
```

## app/app.dart Starter

```dart
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'theme/app_theme.dart';
import 'navigation/app_router.dart';
import '../l10n/app_localizations.dart';

class App extends StatelessWidget {
  const App({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp.router(
      title: 'My App',
      theme: AppTheme.light(),
      darkTheme: AppTheme.dark(),
      routerConfig: appRouter,
      localizationsDelegates: AppLocalizations.localizationsDelegates,
      supportedLocales: AppLocalizations.supportedLocales,
      locale: const Locale('ar'),
      builder: (context, child) {
        final isRtl = Localizations.localeOf(context).languageCode == 'ar';
        return Directionality(
          textDirection: isRtl ? TextDirection.rtl : TextDirection.ltr,
          child: child!,
        );
      },
    );
  }
}
```

## Build Order

When creating a new Flutter app from this template, build in this order:

1. `app/theme/colors.dart` — define the palette
2. `app/theme/text_styles.dart` — define typography
3. `app/theme/spacing.dart` — copy from `resources/spacing-system.md`
4. `app/theme/app_theme.dart` — wire the above into ThemeData
5. `l10n/` — set up translation files
6. `app/app.dart` — root widget
7. `shared/widgets/` — reusable components (one at a time)
8. `app/navigation/app_router.dart` — define routes
9. `features/` — build features one screen at a time
