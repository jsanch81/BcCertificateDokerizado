/**
 * Library Strings
 *
 * Contiene funciones que nos permite trabajar con strings
 *
 * @author Jose Sanchez, Santiago Mendoza, Mayerli Lopez & Efrain Gonzalez
 * @version 1.0
 */
pragma solidity ^0.4.0;

library Strings{

/**
 * Funcion concat, recibe dos string y los concatena
 * @param base, el valor del primer string
 * @param value, el valor del segundo string
 * @return string, concatenacion de los dos string
 */
  function concat(string _base, string _value) internal pure returns(string){
    bytes memory _baseBytes = bytes(_base);
    bytes memory _valueBytes = bytes(_value);

    string memory _tmpValue = new string(_baseBytes.length + _valueBytes.length);
    bytes memory _tmpValueBytes = bytes(_tmpValue);

    uint i;
    uint j;
    for(i=0;i<_baseBytes.length;i++){
      _tmpValueBytes[j++] = _baseBytes[i];
    }
    for(i=0;i<_valueBytes.length;i++){
      _tmpValueBytes[j++] = _valueBytes[i];
    }
    return string(_tmpValueBytes);
  }

/**
 * Funcion uint2str, convierte un uint en un string
 * @param i, uint que se desea pasar a string
 * @return string, valor de uin en tipo string
 */
  function uint2str(uint i) internal pure returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }

/**
 * Funcion uint2str1, convierte un uint16 a un string
 * @param i, el uint16 que se desea convertir
 * @return string, el uint16 convertido en string
 */
   function uint2str1(uint16 i) internal pure returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }

/**
 * Funcion uint2str2, convierte un uint8 en un string
 * @param i, uint8 que se desea convertir
 * @return string, el valor de uint8 convertido en string
 */
   function uint2str2(uint8 i) internal pure returns (string){
    if (i == 0) return "0";
    uint j = i;
    uint length;
    while (j != 0){
      length++;
      j /= 10;
    }
    bytes memory bstr = new bytes(length);
    uint k = length - 1;
    while (i != 0){
      bstr[k--] = byte(48 + i % 10);
      i /= 10;
    }
    return string(bstr);
  }


/**
 * Funcion strpos, comprueba si dos string son iguales
 * @param base, primer string
 * @param value, segundo string
 * @return int, -1 si o son iguales o la posicion en que son iguales
 */
  function strpos(string _base, string _value) internal pure returns(int){
    bytes memory _baseBytes = bytes(_base);
    bytes memory _valueBytes = bytes(_value);

    assert(_valueBytes.length == 1);
    for(uint i = 0; i < _baseBytes.length;i++){
      if(_baseBytes[i]==_valueBytes[0]){
	return int(i);
      }
    }
    return -1;
  }

/**
 * Funcion subString, toma una parte del string con los dos valores dados
 * @param base, string original
 * @param a, valor desde donde se tomara el substring
 * @param b, valor hasta donde se toma el substring
 * @return string, el substring
 */
  function subString(string _base, uint a, uint b)internal pure returns(string){
    bytes memory _baseBytes = bytes(_base);
    assert(a < _baseBytes.length);
    assert(b <= _baseBytes.length);
    assert(b > a);
    string memory _tmpStr = new string(b-a);
    bytes memory _tmpStrBytes = bytes(_tmpStr);

    uint j;
    for(uint i=a;i<b;i++){
      _tmpStrBytes[j++]=_baseBytes[i];
    }
    return string(_tmpStrBytes);
  }

/**
 * Funcion count, devuelve la cantidad de posiciones que son iguales en los strings
 * @param base, primer string
 * @param value, segundo string
 * @return uint, numero de posiciones iguales
 */
  function count(string _base, string _value) internal pure returns(uint){
    bytes memory _baseBytes = bytes(_base);
    bytes memory _valueBytes = bytes(_value);

    assert(_valueBytes.length == 1);
    uint _count=0;
    for(uint i = 0; i < _baseBytes.length;i++){
      if(_baseBytes[i]==_valueBytes[0]){
	_count++;
      }
    }
    return _count;
  }

}
