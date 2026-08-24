#include <SFML/Graphics.hpp> // biblioteka SFML - okno, grafika, rysowanie ksztaltow
#include <cmath>             // funkcja sin() potrzebna do animacji machania nogami

int main()
{
    // ===== OKNO =====
    // Tworzy okno gry o rozmiarze 800x600 pikseli z tytulem
    sf::RenderWindow window(sf::VideoMode(800, 600), "Kulka z nogami");
    window.setFramerateLimit(60); // ogranicza liczbe klatek na sekunde do 60 (plynna animacja, mniejsze zuzycie CPU)

    // ===== PODLOZE (brazowy prostokat) =====
    // Prostokat o szerokosci calego okna (800) i wysokosci 100, ustawiony na dole ekranu
    sf::RectangleShape ground(sf::Vector2f(800.f, 100.f));
    ground.setPosition(0.f, 500.f);          // pozycja lewego-gornego rogu prostokata (x=0, y=500 -> dolna czesc okna)
    ground.setFillColor(sf::Color(139, 69, 19)); // kolor brazowy (RGB)

    // ===== KULKA (cialo postaci) =====
    float ballRadius = 30.f;
    sf::CircleShape ball(ballRadius);
    ball.setOrigin(ballRadius, ballRadius);  // punkt odniesienia to srodek kulki (a nie lewy-gorny rog)
    ball.setFillColor(sf::Color::White);     // kolor kulki
    sf::Vector2f ballCenter(400.f, 470.f);   // srodek kulki: na srodku okna w poziomie, tuz nad podlozem
    ball.setPosition(ballCenter);

    // ===== NOGI (dwie linie) =====
    // Kazda noga to VertexArray z 2 punktami (poczatek i koniec linii)
    sf::VertexArray leftLeg(sf::Lines, 2);
    sf::VertexArray rightLeg(sf::Lines, 2);
    leftLeg[0].color = sf::Color::Black;
    leftLeg[1].color = sf::Color::Black;
    rightLeg[0].color = sf::Color::Black;
    rightLeg[1].color = sf::Color::Black;

    // ===== PARAMETRY ANIMACJI =====
    float legLength = 40.f;   // dlugosc nog (w pikselach)
    float time = 0.f;         // licznik czasu, rosnie z kazda klatka - napedza animacje
    float swingSpeed = 4.f;   // jak szybko nogi maszeruja na boki
    float swingRange = 25.f;  // jak daleko (w pikselach) nogi wychylaja sie od srodka

    sf::Clock clock; // mierzy czas miedzy kolejnymi klatkami (delta time)

    // ===== GLOWNA PETLA GRY =====
    // Wykonuje sie w kolko az uzytkownik zamknie okno
    while (window.isOpen())
    {
        // --- Obsluga zdarzen (np. zamkniecie okna) ---
        sf::Event event;
        while (window.pollEvent(event))
        {
            if (event.type == sf::Event::Closed)
                window.close();
        }

        // --- Aktualizacja czasu ---
        float dt = clock.restart().asSeconds(); // czas jaki uplynal od poprzedniej klatki
        time += dt;                              // sumujemy czas, zeby animacja plynela rownomiernie

        // --- Obliczenie wychylenia nog na boki ---
        // sin() daje plynna, powtarzajaca sie wartosc od -1 do 1, mnozymy przez swingRange
        float swing = std::sin(time * swingSpeed) * swingRange;

        // Punkt, z ktorego "wyrastaja" nogi - dol kulki
        sf::Vector2f hipPoint = ballCenter + sf::Vector2f(0.f, ballRadius - 5.f);

        // Lewa noga: koniec linii przesuwa sie wg wartosci "swing"
        leftLeg[0].position = hipPoint;
        leftLeg[1].position = hipPoint + sf::Vector2f(-10.f + swing, legLength);

        // Prawa noga: przeciwna faza (kiedy lewa idzie w prawo, prawa idzie w lewo - jak przy chodzeniu)
        rightLeg[0].position = hipPoint;
        rightLeg[1].position = hipPoint + sf::Vector2f(10.f - swing, legLength);

        // --- Rysowanie calej sceny ---
        window.clear(sf::Color(100, 180, 255)); // wypelnia tlo kolorem niebieskim
        window.draw(ground);                    // rysuje brazowe podloze
        window.draw(leftLeg);                   // rysuje lewa noge
        window.draw(rightLeg);                  // rysuje prawa noge
        window.draw(ball);                      // rysuje kulke (na wierzchu)
        window.display();                       // pokazuje narysowana klatke na ekranie
    }

    return 0;
}
