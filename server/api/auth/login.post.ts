export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const password = body?.password

  const config = useRuntimeConfig()
  const envPassword = config.adminPassword

  if (!envPassword) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Server configuration error: ADMIN_PASSWORD not set in env'
    })
  }

  if (password === envPassword) {
    // Basic session cookie logic
    setCookie(event, 'auth_token', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })
    
    return {
      success: true,
      message: 'Login successful'
    }
  } else {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid password'
    })
  }
})
