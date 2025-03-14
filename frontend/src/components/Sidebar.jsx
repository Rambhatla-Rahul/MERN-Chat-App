import {
  Box,
  VStack,
  Text,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Flex,
  Icon,
  Badge,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { FiLogOut, FiPlus, FiUsers } from "react-icons/fi";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Sidebar = ({setSelectedGroup}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newGroupName, setNewGroupName] = useState("");
  const [groups, setGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);
  const [newGroupDescription, setNewGroupDescription] = useState("");
  const toast = useToast();
  const [isAdmin,setIsAdmin] = useState(false);
  const navigate = useNavigate();

  const checkAdminStatus = ()=>{
    const userInfo = JSON.parse(localStorage.getItem('userInfo')||{});
    setIsAdmin(userInfo?.isAdmin || false);
  };
  useEffect(()=>{
    checkAdminStatus();
    fetchGroups();
  },[]);


  const fetchGroups = async()=>{
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo')||{});
      const token = userInfo.token;
      const {data} = await axios.get('http://localhost:5000/api/groups',{
        headers:{
          Authorization:`Bearer ${token}`,
        }
      });
      setGroups(data.groups);  
      const userGroupsId = data.groups.filter((groups)=>{
        return groups?.members?.some((member)=>{
          return member?._id === userInfo?._id;
        })
      }).map((group)=>group?._id)
      setUserGroups(userGroupsId);
      
    } catch (error) {
      toast({
        title:'Error',
        description: error.message,
        status:'error',
        duration:5000,
        isClosable:true,
      });
    }
  }

  const createGroup = async()=>{
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || {});      
      const token = userInfo.token;
      if(userInfo.isAdmin){
        const response = await axios.post('http://localhost:5000/api/groups',{
            user: userInfo,
            newGroupName,
            newGroupDescription,
        },{
          headers:{
            Authorization:`Bearer ${token}`,
          },
        });
        console.log(response.data);
        toast({
          title: "Group created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchGroups()
      }
    } catch (error) {
      toast({
        title:'Error',
        description: error.message,
        status:'error',
        duration:5000,
        isClosable:true,
      })
    }
  }


  const joinGroup = async(group)=>{
    try{
      const groupId = group._id;
      const user = JSON.parse(localStorage.getItem('userInfo') || {});      
      const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/join`,{
        user,
      });
      if(response.status === 200){
        toast({
          title:"Joined!",
          description:"Joined the group Successfully!",
          duration:5000,
          isClosable:true,
          status:'success',
        });
      }
      console.log('Joined!');
      await fetchGroups();
      setSelectedGroup(groups.find((g)=>group?._id === groupId))
      
    }catch(error){
      toast({
        title:'Error',
        description: error.message,
        status:'error',
        duration:5000,
        isClosable:true,
      })
    }
  }
  const leaveGroup = async(group)=>{
    try{
      const groupId = group._id;
      const user = JSON.parse(localStorage.getItem('userInfo') || {});      
      const response = await axios.post(`http://localhost:5000/api/groups/${groupId}/leave`,{
        user,
      });
      if(response.status === 200){
        toast({
          title:"Group Left!",
          description:"Left the group Successfully!",
          duration:5000,
          isClosable:true,
          status:'success',
        });
        await fetchGroups();
        setSelectedGroup(null);
      }
      
      
    }catch(error){
      toast({
        title:'Error',
        description: error.message,
        status:'error',
        duration:5000,
        isClosable:true,
      })
    }
    
  }


  const handleLogout = async()=>{
    localStorage.removeItem('userInfo');
    navigate('/login')
  }

  return (
    <Box
      h="100%"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      width="300px"
      display="flex"
      flexDirection="column"
    >
      <Flex
        p={4}
        borderBottom="1px solid"
        borderColor="gray.200"
        bg="white"
        position="sticky"
        top={0}
        zIndex={1}
        backdropFilter="blur(8px)"
        align="center"
        justify="space-between"
      >
        <Flex align="center">
          <Icon as={FiUsers} fontSize="24px" color="blue.500" mr={2} />
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Groups
          </Text>
        </Flex>
        {isAdmin && (
          <Tooltip label="Create New Group" placement="right">
            <Button
              size="sm"
              colorScheme="blue"
              variant="ghost"
              onClick={onOpen}
              borderRadius="full"
            >
              <Icon as={FiPlus} fontSize="20px" />
            </Button>
          </Tooltip>
        )}
      </Flex>

      <Box flex="1" overflowY="auto" p={4} mb={16}>
        <VStack spacing={3} align="stretch">
          {groups.map((group) => (
            <Box
              key={group.id}
              p={4}
              cursor="pointer"
              borderRadius="lg"
              bg={userGroups.includes(group?._id) ? "blue.50" : "gray.50"}
              borderWidth="1px"
              borderColor={group.isJoined ? "blue.200" : "gray.200"}
              transition="all 0.2s"
              _hover={{
                transform: "translateY(-2px)",
                shadow: "md",
                borderColor: "blue.300",
              }}
            >
              <Flex justify="space-between" align="center">
                <Box
                onClick={()=>{
                  userGroups.includes(group?._id) && setSelectedGroup(group)
                }}
                 flex="1">
                  <Flex align="center" mb={2}>
                    <Text fontWeight="bold" color="gray.800">
                      {group.name}
                    </Text>
                    {userGroups.includes(group?._id) && (
                      <Badge ml={2} colorScheme="blue" variant="subtle">
                        Joined
                      </Badge>
                    )}
                  </Flex>
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {group.description}
                  </Text>
                </Box>
                <Button
                  size="sm"
                  colorScheme={userGroups.includes(group?._id) ? "red" : "blue"}
                  variant={userGroups.includes(group?._id) ? "ghost" : "solid"}
                  ml={3}
                  _hover={{
                    transform: group.isJoined ? "scale(1.05)" : "none",
                    bg: group.isJoined ? "red.50" : "blue.600",
                  }}
                  transition="all 0.2s"
                  onClick={(e)=>{
                    if(userGroups.includes(group?._id)){
                      leaveGroup(group);
                    }
                    else{
                      joinGroup(group);
                    }
                    
                  }}
                >
                  {userGroups.includes(group?._id) ? (
                    <Text fontSize="sm" fontWeight="medium">
                      Leave
                    </Text>
                  ) : (
                    "Join"
                  )}
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      <Box
        p={4}
        borderTop="1px solid"
        borderColor="gray.200"
        bg="gray.50"
        position="absolute"
        bottom={0}
        left={0}
        right={0}
        width="100%"
      >
        <Button
        onClick={()=>handleLogout()}
          variant="ghost"
          colorScheme="red"
          leftIcon={<Icon as={FiLogOut} />}
          _hover={{
            bg: "red.50",
            transform: "translateY(-2px)",
            shadow: "md",
          }}
          transition="all 0.2s"
        >
          Logout
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay backdropFilter="blur(9px)"/>
        <ModalContent>
          <ModalHeader>Create New Group</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Group Name</FormLabel>
              <Input
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                placeholder="Enter group name"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Input
                value={newGroupDescription}
                onChange={(e) => setNewGroupDescription(e.target.value)}
                placeholder="Enter group description"
                focusBorderColor="blue.400"
              />
            </FormControl>

            <Button
              colorScheme="blue"
              mr={3}
              mt={4}
              width="full"
              onClick={(e) => {
                e.preventDefault();
                createGroup();
                onClose();
                setNewGroupName("");
                setNewGroupDescription("");
              }}
            >
              Create Group
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Sidebar;
