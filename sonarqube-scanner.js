import sonarqubeScanner from "sonarqube-scanner";

sonarqubeScanner.default(
  {
    serverUrl: "http://localhost:9000",
    login: "sqp_33537b0d214b115aabbb44e4f0c799edfccc68a4",
    password: "123456789+Aze",
    options: {
      "sonar.sources": "./src",
    },
  },
  () => process.exit()
);