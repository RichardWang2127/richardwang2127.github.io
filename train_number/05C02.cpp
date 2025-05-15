#include<bits/stdc++.h>
using namespace std;
//line 5 05C02 Tc Mp M M Mp Tc
string trains[60][10];
string stringConvert(int p){
	string res="";
	while(p){
		res=char(p%10+'0')+res;
		p/=10;
	}
	return res;
}
int main(){
	freopen("05C02.txt","w",stdout);
	for(int Y=69;Y<=266;Y++){
		int A=(Y-2)/6+8;
		int X=(Y-2)%6;
		if(X==0){
			X=6;
			A--;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==6){
			t='1';
		}
		else if(X==2||X==5){
			t='2';
		}
		else{
			t='3';
		}
		string res=Y<100?"050":"05";
		res=res+Y_+t;
		// cout<<Y<<" "<<A<<endl;
		trains[A][X]=res;
	}
	for(int i=19;i<=51;i++){
		bool first=true;
		cout<<"[";
		for(int j=1;j<=6;j++){
			if(!first){
				cout<<", ";
			}
			cout<<'"'<<trains[i][j]<<'"';
			first=false;
		}
		cout<<"],\n";
	}
	return 0;
}

