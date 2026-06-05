plugins { // Rozpoczynamy konfiguracje pluginow Gradle.
    kotlin("jvm") version "1.9.22" // Plugin Kotlin JVM kompiluje kod Kotlin do JVM.
    kotlin("plugin.serialization") version "1.9.22" // Plugin serializacji pozwala uzywac @Serializable.
    application // Plugin application tworzy zadanie uruchamiania aplikacji.
} // Konczymy blok pluginow.

repositories { // Rozpoczynamy konfiguracje repozytoriow zaleznosci.
    mavenCentral() // Pobieramy biblioteki z Maven Central.
} // Konczymy blok repozytoriow.

dependencies { // Rozpoczynamy deklaracje bibliotek projektu.
    implementation("net.dv8tion:JDA:5.0.0-beta.20") // JDA laczy bota z platforma Discord.
    implementation("io.ktor:ktor-client-core:2.3.8") // Rdzen klienta Ktor do zapytan HTTP.
    implementation("io.ktor:ktor-client-cio:2.3.8") // Silnik CIO wykonuje rzeczywiste polaczenia HTTP.
    implementation("io.ktor:ktor-client-content-negotiation:2.3.8") // Plugin Ktor do negocjacji i parsowania tresci.
    implementation("io.ktor:ktor-serialization-kotlinx-json:2.3.8") // Integracja Ktor z kotlinx.serialization JSON.
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:1.7.3") // Coroutines pozwalaja wywolywac funkcje suspend.
    implementation("org.slf4j:slf4j-simple:2.0.9") // Prosta implementacja loggera wymagana przez biblioteki.
} // Konczymy deklaracje zaleznosci.

application { // Rozpoczynamy konfiguracje aplikacji wykonywalnej.
    mainClass.set("pl.ebiznes.discordbot.MainKt") // Wskazujemy klase startowa wygenerowana z pliku Main.kt.
} // Konczymy konfiguracje application.
