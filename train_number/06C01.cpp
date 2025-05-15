#include<bits/stdc++.h>
using namespace std;
//line 6 06C01 Tc Mp Mp Tc
string trains[100][10];
string stringConvert(int p){
	string res="";
	while(p){
		res=char(p%10+'0')+res;
		p/=10;
	}
	return res;
}
int main(){
	freopen("06C01.txt","w",stdout);
	for(int Y=1;Y<=84;Y++){
		int A=(Y)/4+1;
		int X=(Y)%4;
		if(X==0){
			X=4;
			A--;
		}
		if(4<=A&&A<=12){
			A++;
		}
		else if(13<=A&&A<=21){
			A+=2;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==4){
			t='1';
		}
		else if(X==2||X==3){
			t='2';
		}
		string res=Y<100?"060":"06";
		if(Y<10){
			res="0600";
		}
		res=res+Y_+t;
		// cout<<Y<<" "<<A<<endl;
		trains[A][X]=res;
	}
	for(int Y=85;Y<=128;Y++){
		int A=(Y)/4+4;
		int X=(Y)%4;
		if(X==0){
			X=4;
			A--;
		}
		if(A==34||A==35){
			A++;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==4){
			t='1';
		}
		else if(X==2||X==3){
			t='2';
		}
		string res=Y<100?"060":"06";
		res=res+Y_+t;
		// cout<<Y<<" "<<A<<endl;
		trains[A][X]=res;
	}
	for(int Y=129;Y<=200;Y++){
		int A=(Y)/4+5;
		int X=(Y)%4;
		if(X==0){
			X=4;
			A--;
		}
		if(44<=A&&A<=52){
			A++;
		}
		else if(53<=A&&A<=54){
			A+=2;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==4){
			t='1';
		}
		else if(X==2||X==3){
			t='2';
		}
		string res=Y<100?"060":"06";
		if(Y<10){
			res="0600";
		}
		res=res+Y_+t;
		// cout<<Y<<" "<<A<<endl;
		trains[A][X]=res;
	}
	for(int Y=201;Y<=304;Y++){
		int A=(Y)/4+7;
		int X=(Y)%4;
		if(X==0){
			X=4;
			A--;
		}
		string Y_=stringConvert(Y);
		char t;
		if(X==1||X==4){
			t='1';
		}
		else if(X==2||X==3){
			t='2';
		}
		string res=Y<100?"060":"06";
		if(Y<10){
			res="0600";
		}
		res=res+Y_+t;
		// cout<<Y<<" "<<A<<endl;
		trains[A][X]=res;
	}
	for(int i=1;i<=82;i++){
		bool first=true;
		cout<<"[";
		for(int j=1;j<=4;j++){
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

