## **Contributors**
This project is developed as part of APDS7311:

- **ST10024454** Matteo Pita  
- **ST10161340** Tyler Friedman  
- **ST10046014** Nicholas James Malan  
- **ST10043367** Reece Cunningham  
- **ST10043352** Shira Bome


## YouTube Link:

https://youtu.be/jFaIM0AB4lg

## Link to our working repository (action works perfectly here):

https://github.com/TylerFriedman/customer-portal.git

## Project Security and DevSecOps Evaluation

| **Marking Criteria**           | **Explanation of How our Code Exceeds Standards**                                                                                     |
|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------|
| **Password Security**          | - **Argon2 with Salting and Peppering**: Passwords are hashed using Argon2 (argon2id) with salts and a server-side pepper. This adds an extra layer of security, making the password significantly harder to crack. <br> - **Advanced Parameters**: Argon2 settings are fine-tuned (`memoryCost`, `timeCost`, `parallelism`) to increase computational cost, offering exceptional password protection. <br> - **Secure Password Policies**: Password complexity is enforced via strong RegEx, which includes uppercase, lowercase, numbers, and special characters. |
| **Input Whitelisting**         | - **Comprehensive RegEx Patterns**: Inputs are validated using advanced Regular Expressions to ensure they only include expected characters (e.g., usernames, passwords, ID numbers). <br> - **Input Sanitization**: Fields are trimmed and sanitized using `express-validator` to escape potentially harmful characters, mitigating the risks of SQL injection and XSS. <br> - **Validation Across Multiple Fields**: Username, email, password, ID number, and account number are all validated and sanitized, ensuring a consistent and secure approach. |
| **Securing Data in Transit with SSL** | - **HTTPS with SSL Certificates**: The server is configured to use SSL certificates, serving all traffic over HTTPS, which ensures encrypted data transmission. <br> - **HSTS Implementation**: HTTP Strict Transport Security (HSTS) is implemented through Helmet to enforce secure connections, even if a user attempts to connect via HTTP. <br> - **HTTP to HTTPS Redirection**: A middleware is added to automatically redirect all HTTP requests to HTTPS, preventing unencrypted access. |
| **Protecting Against Attacks** | - **Multiple Security Tools Configured**: <br> 1. **Helmet** for setting secure HTTP headers, including CSP, to prevent attacks such as XSS. <br> 2. **Rate Limiting**: Rate limiters (`express-rate-limit`) are set globally and specifically on login and payment routes to prevent brute-force and DDoS attacks. <br> 3. **CSRF Protection**: CSRF tokens are implemented using `csurf` middleware to secure state-changing requests. <br> 4. **HPP Protection**: HTTP Parameter Pollution (HPP) is handled using `hpp` middleware, which ensures only valid parameters are processed. <br> 5. **Brute-Force Login Protection**: Rate limiting on the login route and account lockout mechanisms are set up. <br> - **Secure Cookie Settings**: Cookies are set with secure flags (`HttpOnly`, `Secure`, `SameSite`) to mitigate attacks such as CSRF and session hijacking. |
| **DevSecOps Pipeline**         | - **Comprehensive DevSecOps Pipeline**: The pipeline uses GitHub Actions to automate tests, static code analysis, and secure build processes. <br> - **SonarCloud Integration**: The pipeline integrates **SonarCloud** for code quality and security analysis, with detailed configuration that includes project key, organization, and directories to analyze. <br> - **Multi-Step Deployment**: The pipeline includes multiple steps to ensure secure deployment, including `checkout`, environment setup (Node.js and Java), dependency installation, and security scanning. |
