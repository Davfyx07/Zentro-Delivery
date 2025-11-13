# 🚀 Features Pendientes - Zentro Restaurant

## 📋 Lista de Mejoras Futuras

### 1. 🌎 Internacionalización (i18n)
**Descripción:** Sistema multi-idioma para la aplicación

**Librería recomendada:** `next-intl`

**Implementación:**
- Crear archivos de traducción: `messages/es.json`, `messages/en.json`, `messages/pt.json`
- Agregar selector de idioma en navbar: 🇪🇸 ES | 🇺🇸 EN | 🇧🇷 PT
- Traducir todos los textos estáticos
- Traducir mensajes de error del backend

**Ventajas:**
- Expansión internacional
- Mejor UX para usuarios de diferentes países
- Textos centralizados y fáciles de mantener

---

### 2. 🔐 OAuth - Login Social
**Descripción:** Permitir login con Google, Apple, Facebook

**Librería recomendada:** `Auth.js` (antes NextAuth.js)

**Proveedores sugeridos:**
- ✅ Google (más usado)

**Implementación:**
- Instalar `next-auth`
- Configurar providers en `app/api/auth/[...nextauth]/route.ts`
- Integrar con JWT del backend existente
- Agregar botones en login/signup

**Ventajas:**
- Registro más rápido (1 click)
- Menos contraseñas olvidadas
- Más confianza del usuario
- Standard de la industria

---

### 3. 📧 Verificación de Email
**Descripción:** Confirmar email del usuario al registrarse

**Método recomendado:** Token en link (1 click)

**Flujo:**
1. Usuario se registra
2. Backend genera token único
3. Envía email con link: `https://zentro.com/verify?token=abc123...`
4. Usuario hace click
5. ✅ Cuenta verificada

**Servicios para enviar emails:**
- SendGrid (gratis hasta 100 emails/día)
- AWS SES (muy barato)
- Resend (moderno, fácil de usar)

**Backend (Spring Boot):**
- Agregar `JavaMailSender`
- Crear tabla `email_verification_tokens`
- Endpoint: `POST /auth/verify-email`

---

### 4. 📱 Verificación de Teléfono (SMS)
**Descripción:** Verificar número de teléfono con código de 6 dígitos

**Servicio recomendado:** Twilio ($15 USD gratis de prueba) whatsassp 

**Cuándo verificar:**
- Después del registro (no bloqueante)
- Antes del primer pedido (obligatorio)

**Flujo:**
1. Usuario ingresa teléfono
2. Backend envía SMS con código: "Tu código es: 123456"
3. Usuario ingresa código
4. ✅ Teléfono verificado

**Ventajas:**
- Necesario para contactar al cliente en entregas
- Evita cuentas falsas/spam
- Standard en apps de delivery (Uber, Rappi, DiDi)

**Costo aproximado:** ~$0.008 USD por SMS

---

### 5. 🔑 Recuperación de Contraseña
**Descripción:** Permitir al usuario recuperar su contraseña

**Método recomendado:** Dar opción entre EMAIL o SMS

**Flujo sugerido:**
```
1. Usuario: "Olvidé mi contraseña"
2. Ingresa email
3. Sistema muestra opciones:
   ○ 📧 Enviar código por email (gra***@gmail.com)
   ○ 📱 Enviar código por SMS (+57 *** *** **67)
4. Usuario elige método
5. Recibe código de 6 dígitos
6. Ingresa código + nueva contraseña
7. ✅ Contraseña actualizada
```

**Ventajas:**
- Flexible (usuario elige)
- Si perdió acceso al email → usa SMS
- Económico (solo usa SMS cuando es necesario)

**Seguridad:**
- Código expira en 10 minutos
- Solo 3 intentos permitidos
- Nuevo código invalida el anterior

---

### 6. 🔒 Autenticación de Dos Factores (2FA) - Opcional
**Descripción:** Capa extra de seguridad (opcional para usuarios)

**Cuándo activar:**
- Login desde nuevo dispositivo
- Cambios en la cuenta (email, contraseña)
- Pagos grandes

**Implementación:**
- SMS con código de 6 dígitos
- Google Authenticator (TOTP)

---

## 📊 Prioridades Recomendadas

### 🔥 Prioridad ALTA (Implementar primero)
1. **Verificación de teléfono** - Esencial para delivery
2. **Recuperación de contraseña** - UX básica esperada
3. **Verificación de email** - Reduce spam

### 🚀 Prioridad MEDIA (Siguientes meses)
4. **OAuth (Google/Apple)** - Mejora conversión de registro
5. **i18n** - Solo si planeas expandir a otros países

### 💎 Prioridad BAJA (Nice to have)
6. **2FA opcional** - Para usuarios que quieren extra seguridad

---

## 💰 Estimación de Costos Mensuales

Asumiendo **1000 usuarios activos/mes:**

| Servicio | Uso Estimado | Costo Mensual |
|----------|--------------|---------------|
| Envío de Emails (SendGrid) | 5000 emails | GRATIS |
| SMS verificación (Twilio) | 500 SMS | ~$4 USD |
| SMS recuperación contraseña (Twilio) | 200 SMS | ~$1.60 USD |
| OAuth (Google/Apple) | Ilimitado | GRATIS |
| **TOTAL** | - | **~$6 USD/mes** |

**Conclusión:** Muy económico para la mejora de UX que proporciona ✅

---

## 🛠️ Stack Técnico Necesario

### Backend (Spring Boot)
- `spring-boot-starter-mail` - Para enviar emails
- `twilio-java` - Para enviar SMS
- JWT tokens (ya implementado ✅)

### Frontend (Next.js)
- `next-auth` - Para OAuth
- `next-intl` - Para i18n
- Componentes UI para códigos de verificación

---

## 📝 Notas Adicionales

- **Backend:** Mantener código y variables en inglés (buena práctica ✅)
- **Comentarios:** Pueden estar en español si el equipo es hispanohablante
- **Mensajes de usuario:** Usar i18n para traducir (no hardcodear en backend)
- **Seguridad:** Siempre usar HTTPS en producción
- **Tokens:** Expirar después de 10-15 minutos
- **Rate limiting:** Máximo 3 intentos de verificación

---

**Última actualización:** 7 de noviembre, 2025

