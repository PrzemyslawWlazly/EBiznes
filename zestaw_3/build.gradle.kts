plugins { // Rozpoczyna blok konfiguracji wtyczek (pluginów) niezbędnych do zbudowania projektu Gradle
    kotlin("jvm") version "1.9.22" // Dodaje oficjalną wtyczkę języka Kotlin w wersji 1.9.22, kompilującą kod do maszyny wirtualnej Javy (JVM)
    application // Dodaje wtyczkę 'application', która automatycznie tworzy skrypty startowe i ułatwia uruchamianie naszego bota
} // Kończy blok konfiguracji wtyczek w projekcie

repositories { // Rozpoczyna blok konfiguracji repozytoriów, czyli miejsc w sieci, z których Gradle będzie pobierał biblioteki
    mavenCentral() // Wskazuje, że wszystkie niezbędne biblioteki (jak JDA czy sam Kotlin) mają być pobierane z głównego, bezpiecznego repozytorium Maven Central
} // Kończy blok konfiguracji repozytoriów

dependencies { // Rozpoczyna blok deklaracji zewnętrznych zależności (bibliotek), z których korzysta nasz kod
    implementation("net.dv8tion:JDA:5.0.0-beta.20") // Dodaje bibliotekę JDA (Java Discord API), która stanowi framework do komunikacji z serwerami Discorda
    implementation("org.slf4j:slf4j-simple:2.0.9") // Dodaje prostą implementację systemu logowania SLF4J, która jest wymagana przez framework JDA do wypisywania statusów
} // Kończy blok deklaracji zależności

application { // Rozpoczyna blok konfiguracji specyficzny dla dodanej wcześniej wtyczki 'application'
    mainClass.set("pl.ebiznes.discordbot.MainKt") // Ustawia dokładną ścieżkę do głównej klasy startowej programu (plik Main.kt kompiluje się do klasy MainKt)
} // Kończy blok konfiguracji wtyczki aplikacji