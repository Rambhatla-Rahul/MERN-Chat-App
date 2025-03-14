import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { FiLogIn } from "react-icons/fi";
import { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const handleSumbit = async(e)=>{
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/users/login',{
        email,
        password,
      })
      setLoading(false);
      if(response.data.token){
        toast({
          title:'Success',
          description: 'Sign in successful!',
          status:'success',
          duration:5000,
          isClosable:true,
          position:"top",
          containerStyle:{
            width: "500px",  // Set the width
            maxWidth: "100%",
          },
        });
        localStorage.setItem('userInfo',JSON.stringify(response.data));
        navigate('/chat');
      }
      
    } catch (error) {
      toast({
        title:'Error',
        description: error.response.data.message || 'An error occurred!',
        status:'error',
        duration:5000,
        isClosable:true,
      });
      setLoading(false);
    }
  }

  return (
    <Box
      w="100%"
      h="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgGradient="linear(to-r, blue.600, purple.600)"
    >
      <Box
        display="flex"
        w={["95%", "90%", "80%", "75%"]}
        maxW="1200px"
        h={["auto", "auto", "600px"]}
        borderRadius="2xl"
        overflow="hidden"
        boxShadow="2xl"
      >
        {/* Left Panel - Hidden on mobile */}
        <Box
          display={["none", "none", "flex"]}
          w="50%"
          bgImage="url('https://images.unsplash.com/photo-1579548122080-c35fd6820ecb')"
          bgSize="cover"
          bgPosition="center"
          position="relative"
        >
          <Box
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            bg="blackAlpha.600"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            p={10}
            color="white"
          >
            <Text fontSize="4xl" fontWeight="bold" mb={4}>
              Welcome Back
            </Text>
            <Text fontSize="lg" maxW="400px">
              Stay connected with friends and family through instant messaging
            </Text>
          </Box>
        </Box>

        {/* Right Panel - Login Form */}
        <Box
          w={["100%", "100%", "50%"]}
          bg="white"
          p={[6, 8, 10]}
          display="flex"
          flexDirection="column"
          justifyContent="center"
        >
          <Box display={["block", "block", "none"]} textAlign="center" mb={6}>
            <Box
              as={FiLogIn}
              mx="auto"
              fontSize="3rem"
              color="blue.600"
              mb={2}
            />
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Welcome Back
            </Text>
          </Box>

          <VStack spacing={6} w="100%" maxW="400px" mx="auto">
            <FormControl id="email" isRequired>
              <FormLabel color="gray.700" fontWeight="medium">
                Email
              </FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                size="lg"
                bg="gray.50"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.500" }}
                _focus={{ borderColor: "blue.500" }}
                onChange={(e)=>{setEmail(e.target.value)}}
              />
            </FormControl>

            <FormControl id="password" isRequired>
              <FormLabel color="gray.700" fontWeight="medium">
                Password
              </FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                size="lg"
                bg="gray.50"
                borderColor="gray.200"
                _hover={{ borderColor: "blue.500" }}
                _focus={{ borderColor: "blue.500" }}
                value={password}
                onChange={(e)=>{setPassword(e.target.value)}}
              />
            </FormControl>

            <Button
              colorScheme="blue"
              width="100%"
              size="lg"
              fontSize="md"
              leftIcon={<FiLogIn />}
              onClick={handleSumbit}
              isLoading = {loading}
            >
              Sign In
            </Button>

            <Text color="gray.600">
              Don't have an account?{" "}
              <Link
                to="/register"
                style={{
                  color: "var(--chakra-colors-blue-600)",
                  fontWeight: "500",
                }}
              >
                Register now
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
