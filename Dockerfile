# Code-server ബേസ് ഇമേജ്
FROM linuxserver/code-server:latest

# ആവശ്യമായ ടൂളുകൾ ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN apt-get update && apt-get install -y curl git unzip xz-utils libglu1-mesa

# Flutter SDK ഇൻസ്റ്റാൾ ചെയ്യുന്നു
RUN git clone https://github.com/flutter/flutter.git /opt/flutter
ENV PATH="/opt/flutter/bin:${PATH}"

# Flutter സെറ്റപ്പ് റൺ ചെയ്യുന്നു
RUN flutter doctor

# VS Code പോർട്ട് തുറക്കുന്നു
EXPOSE 8443
