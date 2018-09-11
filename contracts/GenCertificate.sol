/**
 * Contract GenCertificate
 *
 * Contiene las funciones que me permite generar el acta de grado del estudiante
 *
 * @author Jose Sanchez, Santiago Mendoza, Mayerli Lopez & Efrain Gonzalez
 * @version 1.0
 */
pragma solidity ^0.4.0;

import "./Strings.sol";
import "./DateTime.sol";
import "./Dates1.sol";

contract GenCertificate {
    using Strings for *;
    using Dates1 for uint;
    using DateTime for *;

	/** 
	* Estructura que contiene la informacion del estudiante
	*/
   struct InfoStudent {
    string name;
    uint ID;
    string degree;
    string date;
    uint cel;
    string addressHome;
    uint codeStudent;
    uint totalApprove;
    bool canGraduate;
    bool isMatriculate;
    uint nowApproved;
    bool prepractica;
    string estadoPractica;
    bytes32 cod;
    }
	/** 
	* Estructura que contiene la informacion del certificado
	*/
    struct InfoCertificate {
        string name;
        uint ID;
        string degree;
        string date;
        string university;
        string city;
        string state;
        bool isGraduated;
        uint blockNumber;
        bytes32 hashCode;
    }
	/** 
	* Mapa con el nu+mero de cre+ditos
	*/
    mapping (string => uint) private numCredits;
    	/** 
	* Mapa con el estudiante resgistrado
	*/
    mapping (bytes32 => InfoStudent) registeredStudent;
    mapping (uint => bool) validCode;
    event Create(
	address indexed _creater,
	string _name,
  	bytes32 _cod,
	string _degree,
	uint _cel,
	string _addressHome,
	uint _codeStudent
    );

    event Update(
	address indexed _creater,
	bytes32 _cod,
	uint _approvedSemester,
	bool _approvedPrepractica
    );
    event Acta(
	address indexed _creater,
	uint _day,
	uint _month,
	bytes32 _cod
    );
    /** 
    * Mapa del certificado
    */
    mapping (bytes32 => InfoCertificate) private certificate;
    InfoStudent infoStudent;
    InfoCertificate infoCertificate;
	/** 
	* Constructor, inicializa numCredits con tres carreras y la cantidad de creditos y tambien inicializa unas variables
	* de infoStudent en false.
	*/
    constructor() public {
        numCredits["Ingeniería de sistemas"] = 164;
        numCredits["Ingeniería mecánica"] = 174;
        numCredits["Finanzas"] = 160;
        infoStudent.canGraduate = false;
        infoStudent.isMatriculate = false;
        infoCertificate.isGraduated = false;
        infoStudent.prepractica = false;
        infoStudent.estadoPractica = "No vista";
    }

	/** 
	* Funcion de matricular con 5 parametros
	* @param name, el nombre del estudiante
	* @param degree, carrera que cursara el estudiante
	* @param cel, numero de celular del estudiante
	* @param addressHome, direccion de la casa del estudiante
	* @param codeStudent, codigo que se le asigana al estudiante
	* @return cod, valor que relaciona la informacion del estudiante
	*/
    function matriculate (string _name, string _degree, uint _cel, string _addressHome, uint _codeStudent) public returns(bytes32) {
      bytes32 cod = keccak256(_codeStudent);
      if (!registeredStudent[cod].isMatriculate && !validCode[_codeStudent]){
	    validCode[_codeStudent] = true;
	    infoStudent.name = _name;
            //infoStudent.ID = _ID;
            infoStudent.degree = _degree;
            infoStudent.date = todayDate(block.timestamp);
            infoStudent.cel = _cel;
            infoStudent.addressHome = _addressHome;
            infoStudent.codeStudent = _codeStudent;
            infoStudent.totalApprove = numCredits[_degree];
            //infoStudent.totalApprove = 164;
            infoStudent.isMatriculate = true;
            infoStudent.nowApproved = 0;
            infoStudent.cod = cod;
            registeredStudent[cod] = infoStudent;
            emit Create(msg.sender, _name, cod, _degree, _cel, _addressHome, _codeStudent);
            return cod;
        }
        return "0x0";
    }

	/** 
	* Funcion todayDate, toma la fecha actual y la organiza en un formato especial
	* @param timeNow, fecha actual 
	* @return string con un formato de fecha diferente
	*/
    function todayDate (uint timeNow) private pure returns (string) {
        string memory sYear = (timeNow.getYear()).uint2str1();
        string memory sMonth = ((timeNow.getMonth()).uint2str2());
        string memory sDay = ((timeNow.getDay()).uint2str2());

        return ((sDay.concat("/")).concat((sMonth.concat("/")))).concat(sYear);
    }

	/** 
	* Funcion isValid, valida que el codigo del estudiante tenga el numero correcto de digitos
	* @param value, el codigo del estudiante en uint
	* @return un bool, true si contiene 12 digitos y false de lo contrario
	*/
    function isValid (uint _value) private pure returns (bool) {
        uint total = 0;
        bytes memory __value = bytes(_value.uint2str());
        total = __value.length;
        if(total == 12) {
            return true;
        }
        return false;
    }

	/** 
	* Funcion genBlock, genera el bloque por cada semestre para un estudiante 
	* @param cod, codigo que identifica al estudiante en el registeredStudent
	* @param approvedSemester, numero de creditos aprobados en ese semestre
	* @param approvedPrepractica, bool que me indica si el estudiante aprobó la pre-practica
	* @return un bool, false si la practica está perdida, true si el bloque fue creado
	*/
    function genBlock (bytes32 cod, uint approvedSemester, bool approvedPrepractica) public returns(bool){
        int needApprove = int(registeredStudent[cod].totalApprove - registeredStudent[cod].nowApproved);
        if (registeredStudent[cod].isMatriculate && validCredits(approvedSemester, needApprove) && !registeredStudent[cod].canGraduate) {
            if(keccak256("perdida")==keccak256(registeredStudent[cod].estadoPractica)) return false;
            if(registeredStudent[cod].prepractica && keccak256(registeredStudent[cod].estadoPractica) == keccak256("No vista") && registeredStudent[cod].nowApproved >= 122){
                if(approvedSemester == 18){
                    registeredStudent[cod].estadoPractica = "ganada";
                }else{
                    registeredStudent[cod].estadoPractica = "perdida";
                    return false;
                }
            }

            registeredStudent[cod].nowApproved += approvedSemester;

            if(keccak256(registeredStudent[cod].estadoPractica) == keccak256("ganada") && registeredStudent[cod].nowApproved ==  registeredStudent[cod].totalApprove){
                 registeredStudent[cod].canGraduate = true;
            }

            if(!registeredStudent[cod].prepractica && registeredStudent[cod].nowApproved >= 103){
                registeredStudent[cod].prepractica = approvedPrepractica;
            }

            emit Update(msg.sender, cod, approvedSemester, approvedPrepractica);
            return true;
        }
        return false;
    }

	/** 
	* Funcion getBlock, nos devuelve la informacion de un bloque
	* @param cod, codigo que identifica al estudiante en registeredStudent
	* @return uint, numero de creditos aprobados hasta el momento
	* @return uint, numero de creditos que le falta aprobar
	* @return bool, boleano que me indica si el estudiante ya se puede graduar
	* @return string, nombre del estudiante
	* @return bool, boleano que indica si el estudiante ya aprobo pre-practica
	* @return uint, codigo del estudiante
	* @return bytes32, codigo que identifica al estudiante en el redisteredStudent
	*/
    function getBlock(bytes32 cod) constant returns(uint,uint,bool,string,bool,uint,bytes32){
        return (registeredStudent[cod].nowApproved,registeredStudent[cod].totalApprove,registeredStudent[cod].canGraduate,registeredStudent[cod].name,registeredStudent[cod].prepractica,registeredStudent[cod].codeStudent,registeredStudent[cod].cod);
    }

	/** 
	* Funcion genActa, genera el certificado de acta de grado
	* @param codeStudent, codigo del estudiante
	* @param day, dia en que se genera el acta de grado
	* @param month, mes en que se genera el acta de grado
	* @param cod, codigo que identifica al estudiante 
	* @return bytes32, con el codigo que me relaciona al acta de grado generada
	* @retrun string, con un mensaje que me indica si el estudiante, puede graduarse, ya posee acta, no puede graduarse o no esta matriculado
	*/
    function genActa (uint _codeStudent, uint day, uint month, bytes32 cod) public returns (bytes32, string) {
        if (registeredStudent[cod].isMatriculate && registeredStudent[cod].canGraduate && !certificate[keccak256(_codeStudent,cod)].isGraduated) {

            infoCertificate.name = registeredStudent[cod].name;
            //infoCertificate.ID = registeredStudent[cod].ID;
            infoCertificate.degree = registeredStudent[cod].degree;
            infoCertificate.date = Dates1.date(day, month, uint(block.timestamp.getYear()));
            infoCertificate.university = "Universidad Eafit";
            infoCertificate.city = "Medellín";
            infoCertificate.state = "Graduado";
            infoCertificate.isGraduated = true;
            infoCertificate.blockNumber = block.number;
            bytes32 _hashCode = keccak256(_codeStudent,cod);
            infoCertificate.hashCode = _hashCode;
            certificate[_hashCode] = infoCertificate;
            emit Acta(msg.sender, day, month, cod);
            return (_hashCode, "Puede graduarse");
        }
        if(certificate[keccak256(_codeStudent,day,month)].isGraduated) {
            return (0x0, "Ya posee un acta de grado");
        }
        if (registeredStudent[cod].isMatriculate) {
             return (0x0, "No puede graduarse");
        }
        return (0x0, "No matriculado");
    }

	/** 
	* Funcion validCredits, valida los creditos aprobados y los que necesita aprobar
	* @param approvedSemestee, cantidad de creditos aprobados 
	* @param needApprove, numero de creditos que necesita aprobar
	* @return un bool, true si el valor de creditos aprobados esta en el rango y que necesite aprobar creditos, de lo contrario false
	*/
    function validCredits (uint approvedSemester, int needApprove) private pure returns (bool) {
        if ((approvedSemester >= 0 && approvedSemester <= 23 && needApprove > 0 && needApprove - int(approvedSemester) >= 0)) {
            return true;
        }
        return false;
    }

	/** 
	* Funcion getCertificate, devuelve los datos de un certificado
	* @param hashCode, codigo que identifica al certificado
	* @return name, nombre del estudiante
	* @return id, 
	* @return degree, carrera de la que está graduado el estudiante 
	* @return date, fecha en la que se graduo e le estudiante
	* @return university, univerdidad donde estudio el estudiante
	* @return city, ciudad de donde es el estudiante
	* @return state, estado del certificado, ejemplo que no tenga certificado
	*/
   function getCertificate (bytes32 _hashCode) public view returns (string _name, uint _ID, string _degree, string _date, string _university, string _city, string _state) {
       if (validHash(_hashCode) && certificate[_hashCode].isGraduated) {
           return (certificate[_hashCode].name,
                    certificate[_hashCode].ID,
                    certificate[_hashCode].degree,
                    certificate[_hashCode].date,
                    certificate[_hashCode].university,
                    certificate[_hashCode].city,
                    certificate[_hashCode].state);
                    getCertificateBlock(_hashCode);
       }
       return ("",0,"","","","","No tiene certificado");
   }

	/** 
	* Funcion getCertificateBlock, genera el bloque por cada semestre para un estudiante 
	* @param hashCode, codigo que identifica al estudiante 
	* @return blockNumber,  numero de bloque
	* @return hashCode, numero que identifica al estudiante
	*/
   function getCertificateBlock (bytes32 _hashCode) public view returns (uint blockNumber, bytes32 __hashCode){
        if (validHash(_hashCode) && certificate[_hashCode].isGraduated) {
            return (certificate[_hashCode].blockNumber,
                    certificate[_hashCode].hashCode);
        }
        return (0, 0x0);
   }

	/** 
	* Funcion validHash, valida que el hash sea correcto
	* @param hashCode, codigo que identifica al estudiante 
	* @return un bool, true si el hash es diferente de cero de lo contrario es false
	*/
   function validHash (bytes32 hashCode) private pure returns (bool) {
       if (hashCode[0] != 0) {
           return true;
       }
       return false;
   }

}
